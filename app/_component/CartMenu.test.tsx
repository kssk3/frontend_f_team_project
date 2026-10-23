import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useCartStore } from '@/domains/cart/stores/useCartStore';
import type { CartItem, CartOptionRow } from '@/domains/cart/types/types';

const sdk = vi.hoisted(() => ({ create: vi.fn(), fetchGuest: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('@/shared/lib/supabase', () => ({ createServerClient: sdk.create }));
vi.mock('@/domains/cart/actions/getGuestCartItems.actions', () => ({ fetchGuestCartItems: sdk.fetchGuest }));
vi.mock('next/server', () => ({ connection: async () => {} }));
vi.mock('next/navigation', () => ({ usePathname: () => '/cart' }));

const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const guestItem = (id: string, quantity: number): CartItem => ({
    id, optionId: id, productId: 'p', brandName: 'brand', productName: 'shirt', size: 'M', imageUrl: '',
    basePrice: 10000, salePrice: 10000, extraPrice: 0, quantity, stock: 10, status: 'available', deliveryFee: 0, deliveryType: '일반배송',
});
const option = (id: string, stock: number): CartOptionRow => ({
    id, size: 'M', extra_price: 0, stock,
    products: { id: 'p', name: 'shirt', base_price: 10000, sale_price: 10000, delivery_type: '일반배송', delivery_fee: 0, brands: { name: 'brand' }, product_images: [] },
});
let user: { id: string } | null;
let authError: { name: string } | null;
let profileError: { message: string } | null;
let cartError: { message: string } | null;
const dbRows = [
    { id: 'row-a', user_id: 'member-a', quantity: 2, deleted_at: null, product_options: option(A, 10) },
    { id: 'row-b', user_id: 'member-a', quantity: 3, deleted_at: null, product_options: option(B, 0) },
    { id: 'row-c', user_id: 'member-a', quantity: 9, deleted_at: '2026-01-01', product_options: option(B, 10) },
    { id: 'row-d', user_id: 'member-a', quantity: 7, deleted_at: null, product_options: null },
    { id: 'row-e', user_id: 'member-b', quantity: 4, deleted_at: null, product_options: option(A, 10) },
];

beforeEach(() => {
    vi.resetAllMocks();
    user = null; authError = { name: 'AuthSessionMissingError' }; profileError = null; cartError = null;
    localStorage.clear();
    useCartStore.setState({ items: [{ optionId: A, quantity: 2 }, { optionId: B, quantity: 3 }], _hasHydrated: true });
    sdk.fetchGuest.mockImplementation(async (items: { optionId: string; quantity: number }[]) => items.map((item) => guestItem(item.optionId, item.quantity)));
    sdk.create.mockReturnValue({
        auth: { getUser: async () => ({ data: { user }, error: authError }) },
        from: (table: string) => {
            const filters: ((row: typeof dbRows[number]) => boolean)[] = [];
            const builder = {
                select: () => builder,
                eq: (key: string, value: unknown) => { filters.push((row) => row[key as keyof typeof row] === value); return builder; },
                is: (key: string, value: unknown) => { filters.push((row) => row[key as keyof typeof row] === value); return builder; },
                order: () => builder,
                maybeSingle: async () => ({ data: user ? { id: user.id, deleted_at: null } : null, error: profileError }),
                overrideTypes: async () => ({ data: table === 'cart_items' ? dbRows.filter((row) => filters.every((filter) => filter(row))) : [], error: cartError }),
            };
            return builder;
        },
    });
});
afterEach(cleanup);

async function menu() { const { default: CartMenu } = await import('./CartMenu'); return CartMenu(); }

test('guest badge reacts to additions/removals and points to the actual cart route', async () => {
    render(await menu());
    const count = await screen.findByLabelText('장바구니 수량 5개');
    expect(count.textContent).toBe('5');
    expect(screen.getByRole('link', { name: '장바구니' }).getAttribute('href')).toBe('/cart');
    await act(async () => useCartStore.getState().remove(A));
    expect(await screen.findByLabelText('장바구니 수량 3개')).toBeTruthy();
    await act(async () => useCartStore.getState().add(B, 1));
    expect(await screen.findByLabelText('장바구니 수량 4개')).toBeTruthy();
    await act(async () => useCartStore.getState().clear());
    expect(await screen.findByLabelText('장바구니 수량 0개')).toBeTruthy();
});

test('guest badge waits for hydration and excludes metadata-invisible items', async () => {
    useCartStore.setState({ _hasHydrated: false });
    render(await menu());
    expect(screen.queryByLabelText('장바구니 수량 0개')).toBeNull();
    expect(screen.getByLabelText('장바구니 수량 확인 중')).toBeTruthy();
    sdk.fetchGuest.mockResolvedValue([guestItem(A, 2)]);
    await act(async () => useCartStore.getState().setHasHydrated(true));
    expect(await screen.findByLabelText('장바구니 수량 2개')).toBeTruthy();
});

test('guest metadata failure shows an unknown quantity, not zero', async () => {
    sdk.fetchGuest.mockRejectedValue(new Error('offline'));
    render(await menu());
    expect(await screen.findByLabelText('장바구니 수량 확인 실패')).toBeTruthy();
    expect(screen.queryByLabelText('장바구니 수량 0개')).toBeNull();
});

test('member badge uses owned active visible rows and includes sold-out quantity', async () => {
    user = { id: 'member-a' }; authError = null;
    render(await menu());
    expect(screen.getByLabelText('장바구니 수량 5개')).toBeTruthy();
    expect(sdk.fetchGuest).not.toHaveBeenCalled();
});

test('account switching and logout replace member data without polluting the guest store', async () => {
    user = { id: 'member-a' }; authError = null;
    const view = render(await menu());
    user = { id: 'member-b' };
    view.rerender(await menu());
    expect(screen.getByLabelText('장바구니 수량 4개')).toBeTruthy();
    expect(screen.queryByLabelText('장바구니 수량 5개')).toBeNull();
    user = null; authError = { name: 'AuthSessionMissingError' };
    view.rerender(await menu());
    expect(await screen.findByLabelText('장바구니 수량 5개')).toBeTruthy();
    expect(useCartStore.getState().items).toEqual([{ optionId: A, quantity: 2 }, { optionId: B, quantity: 3 }]);
});

test.each(['auth', 'profile', 'cart'])('member %s failures never fall back to a guest count', async (failure) => {
    user = { id: 'member-a' }; authError = null;
    if (failure === 'auth') authError = { name: 'AuthRetryableFetchError' };
    if (failure === 'profile') profileError = { message: 'offline' };
    if (failure === 'cart') cartError = { message: 'offline' };
    render(await menu());
    expect(screen.getByLabelText('장바구니 수량 확인 실패')).toBeTruthy();
    expect(sdk.fetchGuest).not.toHaveBeenCalled();
});
