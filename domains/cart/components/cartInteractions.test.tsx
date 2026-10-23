import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { ComponentProps } from 'react';
import GuestCartView from './GuestCartView';
import CartView from './CartView';
import AddToCartForm from './AddToCartForm';
import CartBadge from './CartBadge';
import { useCartStore } from '../stores/useCartStore';
import type { CartItem } from '../types/types';

const transport = vi.hoisted(() => ({ fetch: vi.fn(), remove: vi.fn(), add: vi.fn(), refresh: vi.fn(), push: vi.fn() }));
vi.mock('../actions/getGuestCartItems.actions', () => ({ fetchGuestCartItems: transport.fetch }));
vi.mock('../actions/removeCartItem.actions', () => ({ removeCartItems: transport.remove }));
vi.mock('../actions/addToCartItem.actions', () => ({ addToCartItem: transport.add }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: transport.refresh, push: transport.push }), usePathname: () => '/cart' }));
vi.mock('next/link', () => ({ default: (props: ComponentProps<'a'>) => <a {...props} /> }));
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} /> }));

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const base: CartItem = {
    id: A, optionId: A, productId: 'p-a', productName: '셔츠 A', brandName: '브랜드', size: 'M',
    imageUrl: '', basePrice: 12000, salePrice: 10000, extraPrice: 0, deliveryType: '일반배송',
    deliveryFee: 3000, quantity: 2, stock: 10, status: 'available',
};
const items: CartItem[] = [base, { ...base, id: B, optionId: B, productId: 'p-b', productName: '셔츠 B', quantity: 3 }];

beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    useCartStore.setState({ items: [{ optionId: A, quantity: 2 }, { optionId: B, quantity: 3 }], _hasHydrated: true });
    transport.fetch.mockImplementation(async (stored: { optionId: string }[]) => items.filter((row) => stored.some((item) => item.optionId === row.optionId)));
});
afterEach(cleanup);

test('guest X removal updates persistent data and the last removal shows the empty state', async () => {
    const user = userEvent.setup();
    render(<><CartBadge actor="guest" /><GuestCartView /></>);
    expect(await screen.findByLabelText('장바구니 수량 5개')).toBeTruthy();
    await user.click(await screen.findByRole('button', { name: '셔츠 A 삭제' }));
    expect(useCartStore.getState().items).toEqual([{ optionId: B, quantity: 3 }]);
    expect(await screen.findByLabelText('장바구니 수량 3개')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '셔츠 A 삭제' })).toBeNull();
    await user.click(await screen.findByRole('button', { name: '셔츠 B 삭제' }));
    expect(await screen.findByText('장바구니에 담긴 상품이 없습니다.')).toBeTruthy();
    expect(await screen.findByLabelText('장바구니 수량 0개')).toBeTruthy();
    await useCartStore.persist.rehydrate();
    expect(useCartStore.getState().items).toEqual([]);
    expect(transport.remove).not.toHaveBeenCalled();
});

test('unchecked rows remain displayed while payment and selected removal use only checked rows', async () => {
    const user = userEvent.setup();
    render(<><CartBadge actor="guest" /><GuestCartView /></>);
    await user.click(await screen.findByRole('checkbox', { name: '셔츠 A 선택' }));
    expect(await screen.findByLabelText('장바구니 수량 5개')).toBeTruthy();
    expect(screen.getByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '33,000원 주문하기' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: '선택 삭제' }));
    expect(useCartStore.getState().items).toEqual([{ optionId: A, quantity: 2 }]);
    expect(await screen.findByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '셔츠 B 삭제' })).toBeNull();
});

test('all selection is controlled and an empty selection disables bulk delete and payment', async () => {
    const user = userEvent.setup();
    render(<GuestCartView />);
    await user.click(await screen.findByRole('checkbox', { name: '전체' }));
    expect((screen.getByRole('checkbox', { name: '셔츠 A 선택' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('checkbox', { name: '셔츠 B 선택' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('button', { name: '선택 삭제' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: '0원 주문하기' }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole('checkbox', { name: '전체' }));
    expect((screen.getByRole('checkbox', { name: '셔츠 A 선택' }) as HTMLInputElement).checked).toBe(true);
});

test('metadata failure is an error with retry rather than a false empty cart', async () => {
    transport.fetch.mockRejectedValueOnce(new Error('offline'));
    const user = userEvent.setup();
    render(<GuestCartView />);
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByText('장바구니에 담긴 상품이 없습니다.')).toBeNull();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(await screen.findByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
});

test('retrying failed guest metadata recovers both visible rows and header without changing stored items', async () => {
    transport.fetch.mockRejectedValueOnce(new Error('offline')).mockRejectedValueOnce(new Error('offline'));
    const stored = useCartStore.getState().items;
    const user = userEvent.setup();
    render(<><CartBadge actor="guest" /><GuestCartView /></>);
    expect(await screen.findByLabelText('장바구니 수량 확인 실패')).toBeTruthy();
    expect(await screen.findByRole('alert')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(await screen.findByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
    expect(await screen.findByLabelText('장바구니 수량 5개')).toBeTruthy();
    expect(useCartStore.getState().items).toBe(stored);
});

test('a badge-only metadata failure offers recovery while the visible cart is already healthy', async () => {
    transport.fetch.mockRejectedValueOnce(new Error('offline'));
    const stored = useCartStore.getState().items;
    const user = userEvent.setup();
    render(<CartBadge actor="guest" />);
    expect(await screen.findByLabelText('장바구니 수량 확인 실패')).toBeTruthy();
    render(<GuestCartView />);
    expect(await screen.findByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
    await user.click(screen.getByRole('checkbox', { name: '셔츠 A 선택' }));
    await user.click(screen.getByRole('button', { name: '장바구니 수량 다시 확인' }));
    expect(await screen.findByLabelText('장바구니 수량 5개')).toBeTruthy();
    expect(await screen.findByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
    expect((screen.getByRole('checkbox', { name: '셔츠 A 선택' }) as HTMLInputElement).checked).toBe(false);
    expect(useCartStore.getState().items).toBe(stored);
});

test('member X deletion restores keyboard focus after pending controls are enabled and the row disappears', async () => {
    let finish!: (result: { success: boolean; removedIds: string[] }) => void;
    transport.remove.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    const user = userEvent.setup();
    const view = render(<CartView items={items} isLoggedIn />);
    await user.click(screen.getByRole('button', { name: '셔츠 A 삭제' }));
    expect((screen.getByRole('checkbox', { name: '전체' }) as HTMLInputElement).disabled).toBe(true);
    view.rerender(<CartView items={[items[1]]} isLoggedIn />);
    expect(screen.queryByRole('button', { name: '셔츠 A 삭제' })).toBeNull();
    expect((screen.getByRole('checkbox', { name: '전체' }) as HTMLInputElement).disabled).toBe(true);
    await act(async () => finish({ success: true, removedIds: [A] }));
    expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: '전체' }));
    expect((document.activeElement as HTMLInputElement).disabled).toBe(false);
});

test('selected deletion focuses an enabled control when every remaining row is unchecked', async () => {
    transport.remove.mockResolvedValue({ success: true, removedIds: [B] });
    const user = userEvent.setup();
    const view = render(<CartView items={items} isLoggedIn />);
    await user.click(screen.getByRole('checkbox', { name: '셔츠 A 선택' }));
    await user.click(screen.getByRole('button', { name: '선택 삭제' }));
    view.rerender(<CartView items={[items[0]]} isLoggedIn />);
    expect((screen.getByRole('checkbox', { name: '셔츠 A 선택' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('button', { name: '선택 삭제' }) as HTMLButtonElement).disabled).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: '전체' }));
});

test.each(['guest', 'member'])('last %s deletion restores focus to the empty-cart shopping link', async (actor) => {
    const user = userEvent.setup();
    useCartStore.setState({ items: [{ optionId: A, quantity: 2 }] });
    transport.remove.mockResolvedValue({ success: true, removedIds: [A] });
    const view = render(actor === 'guest' ? <GuestCartView /> : <CartView items={[items[0]]} isLoggedIn />);
    await user.click(await screen.findByRole('button', { name: '셔츠 A 삭제' }));
    if (actor === 'member') view.rerender(<CartView items={[]} isLoggedIn />);
    expect(await screen.findByText('장바구니에 담긴 상품이 없습니다.')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: '쇼핑 계속하기' }));
});

test('guest storage waits for hydration before declaring an empty cart', () => {
    useCartStore.setState({ items: [], _hasHydrated: false });
    render(<GuestCartView />);
    expect(screen.getByText('장바구니를 불러오는 중입니다…')).toBeTruthy();
    expect(screen.queryByText('장바구니에 담긴 상품이 없습니다.')).toBeNull();
});

test('member deletion uses row IDs, prevents repeated requests and never changes guest storage', async () => {
    let finish!: (result: { success: boolean; removedIds: string[] }) => void;
    transport.remove.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    const memberItems = [{ ...base, id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }, items[1]];
    const user = userEvent.setup();
    const view = render(<CartView items={memberItems} isLoggedIn />);
    await user.click(screen.getByRole('button', { name: '셔츠 A 삭제' }));
    expect((screen.getByRole('button', { name: '셔츠 B 삭제' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '셔츠 A 삭제' }));
    expect(transport.remove).toHaveBeenCalledTimes(1);
    expect(transport.remove).toHaveBeenCalledWith(['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa']);
    await act(async () => finish({ success: true, removedIds: ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'] }));
    expect(transport.refresh).toHaveBeenCalled();
    expect(useCartStore.getState().items).toHaveLength(2);
    view.rerender(<CartView items={[items[1]]} isLoggedIn />);
    expect(screen.queryByRole('button', { name: '셔츠 A 삭제' })).toBeNull();
    expect((screen.getByRole('button', { name: '선택 삭제' }) as HTMLButtonElement).disabled).toBe(false);
});

test('member selected deletion preserves an unchecked row and reconciles partial outcomes', async () => {
    transport.remove.mockResolvedValue({ success: false, removedIds: [B], message: '일부 상품만 삭제되었습니다.' });
    const user = userEvent.setup();
    const view = render(<CartView items={items} isLoggedIn />);
    await user.click(screen.getByRole('checkbox', { name: '셔츠 A 선택' }));
    await user.click(screen.getByRole('button', { name: '선택 삭제' }));
    expect(transport.remove).toHaveBeenCalledWith([B]);
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', '일부 상품만 삭제되었습니다.');
    expect(transport.refresh).toHaveBeenCalled();
    view.rerender(<CartView items={[items[0]]} isLoggedIn />);
    expect((screen.getByRole('checkbox', { name: '셔츠 A 선택' }) as HTMLInputElement).checked).toBe(false);
    expect((screen.getByRole('button', { name: '선택 삭제' }) as HTMLButtonElement).disabled).toBe(true);
});

test('selected deletion batches a large member cart within the server input bound', async () => {
    const many = Array.from({ length: 51 }, (_, index) => ({
        ...base, id: `aaaaaaaa-aaaa-4aaa-8aaa-${index.toString(16).padStart(12, '0')}`, productName: `상품 ${index}`,
    }));
    transport.remove.mockImplementation(async (ids: string[]) => ({ success: true, removedIds: ids }));
    const user = userEvent.setup();
    render(<CartView items={many} isLoggedIn />);
    await user.click(screen.getByRole('button', { name: '선택 삭제' }));
    expect(transport.remove).toHaveBeenCalledTimes(2);
    expect(transport.remove.mock.calls.flatMap(([ids]) => ids).sort()).toEqual(many.map((item) => item.id).sort());
    expect(transport.remove.mock.calls.every(([ids]) => ids.length <= 50)).toBe(true);
});

test('failed member delete retains rows and permits retry', async () => {
    transport.remove.mockResolvedValue({ success: false, removedIds: [], message: '삭제하지 못했습니다.' });
    const user = userEvent.setup();
    render(<CartView items={items} isLoggedIn />);
    await user.click(screen.getByRole('button', { name: '셔츠 A 삭제' }));
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', '삭제하지 못했습니다.');
    expect(screen.getByRole('button', { name: '셔츠 A 삭제' })).toBeTruthy();
    expect((screen.getByRole('button', { name: '선택 삭제' }) as HTMLButtonElement).disabled).toBe(false);
    expect(transport.refresh).not.toHaveBeenCalled();
});

test('typed guest addition changes the guest store and refreshes header data after navigation', async () => {
    transport.add.mockResolvedValue({ success: true, mode: 'guest' });
    const user = userEvent.setup();
    render(<AddToCartForm optionId={A} quantity={1} />);
    await user.click(screen.getByRole('button', { name: '장바구니에 담기' }));
    await waitFor(() => expect(useCartStore.getState().items[0].quantity).toBe(3));
    expect(transport.push).toHaveBeenCalledWith('/cart');
    expect(transport.refresh).toHaveBeenCalled();
});

test('member addition and authentication failures never leak into guest storage', async () => {
    const user = userEvent.setup();
    const view = render(<AddToCartForm optionId={A} quantity={1} />);
    transport.add.mockResolvedValueOnce({ success: true, mode: 'member' });
    await user.click(screen.getByRole('button', { name: '장바구니에 담기' }));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    transport.add.mockResolvedValueOnce({ success: false, message: '로그인 후 이용해 주세요.' });
    await user.click(screen.getByRole('button', { name: '장바구니에 담기' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    view.unmount();
});
