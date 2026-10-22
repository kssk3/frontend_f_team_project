import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import ComingSoonProvider, {
    COMING_SOON_AUTO_CLOSE_MS,
    COMING_SOON_MESSAGE,
    useOpenComingSoon,
} from './ComingSoonProvider';

function OpenButton() {
    const openComingSoon = useOpenComingSoon();
    return (
        <button type="button" onClick={openComingSoon}>
            열기
        </button>
    );
}

// 닫힌 토스트는 aria-hidden 이라 role 로 찾을 수 없다
const toast = () => screen.queryByRole('status', { name: '준비 중 안내' });

beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

function setup() {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
        <ComingSoonProvider>
            <OpenButton />
        </ComingSoonProvider>,
    );
    return user;
}

test('처음에는 보이지 않고, 열면 준비 중 문구를 알린다', async () => {
    const user = setup();
    expect(toast()).toBeNull();

    await user.click(screen.getByRole('button', { name: '열기' }));
    expect(toast()?.textContent).toContain(COMING_SOON_MESSAGE);
});

test.each([
    ['확인 버튼', 'confirm'],
    ['X 버튼', 'close'],
    ['Escape 키', 'escape'],
] as const)('%s 으로 닫는다', async (_label, how) => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: '열기' }));

    if (how === 'escape') await user.keyboard('{Escape}');
    else
        await user.click(
            screen.getByRole('button', {
                name: how === 'confirm' ? '확인' : '닫기',
            }),
        );

    expect(toast()).toBeNull();
});

test('토스트처럼 잠시 뒤 저절로 닫힌다', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: '열기' }));

    act(() => vi.advanceTimersByTime(COMING_SOON_AUTO_CLOSE_MS - 100));
    expect(toast()).not.toBeNull();

    act(() => vi.advanceTimersByTime(100));
    expect(toast()).toBeNull();
});

test('떠 있는 동안 다시 열면 닫히는 시간을 처음부터 센다', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: '열기' }));
    act(() => vi.advanceTimersByTime(COMING_SOON_AUTO_CLOSE_MS - 500));

    await user.click(screen.getByRole('button', { name: '열기' }));
    act(() => vi.advanceTimersByTime(COMING_SOON_AUTO_CLOSE_MS - 100));
    expect(toast()).not.toBeNull();

    act(() => vi.advanceTimersByTime(100));
    expect(toast()).toBeNull();
});

test('화면을 막지 않는다 (모달이 아니라 포커스를 빼앗지 않음)', async () => {
    const user = setup();
    const opener = screen.getByRole('button', { name: '열기' });
    await user.click(opener);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
});
