import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import ComingSoonProvider, { COMING_SOON_MESSAGE } from './ComingSoonProvider';
import NavLink from './NavLink';

// Next 라우터 없이 "클릭을 막았는지"만 보기 위해 일반 <a> 로 바꾼다
vi.mock('next/link', () => ({
    default: ({
        href,
        prefetch,
        ...rest
    }: ComponentProps<'a'> & { prefetch?: boolean | null }) => (
        <a href={href} data-prefetch={String(prefetch)} {...rest} />
    ),
}));

// 준비 중 안내 토스트 (닫혀 있으면 aria-hidden 이라 null)
const toast = () => screen.queryByRole('status', { name: '준비 중 안내' });

// React 의 클릭 처리가 끝난 뒤 이동이 막혔는지(preventDefault) 기록한다
let lastClickPrevented: boolean | undefined;
const recordClick = (event: MouseEvent) => {
    lastClickPrevented = event.defaultPrevented;
};
beforeEach(() => {
    lastClickPrevented = undefined;
    document.addEventListener('click', recordClick);
});
afterEach(() => {
    document.removeEventListener('click', recordClick);
    cleanup();
});

test('만들어진 페이지 링크는 막지 않고 미리 불러오기도 그대로 둔다', async () => {
    const user = userEvent.setup();
    render(
        <ComingSoonProvider>
            <NavLink href="/help/vendor">입점 문의</NavLink>
        </ComingSoonProvider>,
    );

    const link = screen.getByRole('link', { name: '입점 문의' });
    expect(link.dataset.prefetch).toBe('undefined');

    await user.click(link);
    expect(lastClickPrevented).toBe(false);
    expect(toast()).toBeNull();
});

test('아직 없는 페이지 링크는 이동을 막고 준비 중 안내를 띄운 뒤 확인으로 닫는다', async () => {
    const user = userEvent.setup();
    render(
        <ComingSoonProvider>
            <NavLink href="/women/clothing/outer">아우터</NavLink>
        </ComingSoonProvider>,
    );

    const link = screen.getByRole('link', { name: '아우터' });
    expect(link.dataset.prefetch).toBe('false');

    await user.click(link);
    expect(lastClickPrevented).toBe(true);
    expect(toast()?.textContent).toContain(COMING_SOON_MESSAGE);

    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(toast()).toBeNull();
});

// PR #47 Codex P2: 새 탭·새 창으로 여는 클릭은 브라우저 기본 동작을 막지 않는다
test.each([
    ['Cmd + 클릭 (새 탭, macOS)', { metaKey: true }],
    ['Ctrl + 클릭 (새 탭)', { ctrlKey: true }],
    ['Shift + 클릭 (새 창)', { shiftKey: true }],
    ['Alt + 클릭', { altKey: true }],
    ['왼쪽이 아닌 버튼 클릭', { button: 1 }],
])('%s 은 막지 않고 토스트도 띄우지 않는다', (_label, init) => {
    render(
        <ComingSoonProvider>
            <NavLink href="/women">WOMEN</NavLink>
        </ComingSoonProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'WOMEN' }), init);

    expect(lastClickPrevented).toBe(false);
    expect(toast()).toBeNull();
});

test('넘겨준 onClick 이 이동을 막았으면 토스트를 띄우지 않는다', async () => {
    const user = userEvent.setup();
    render(
        <ComingSoonProvider>
            <NavLink href="/women" onClick={(event) => event.preventDefault()}>
                WOMEN
            </NavLink>
        </ComingSoonProvider>,
    );

    await user.click(screen.getByRole('link', { name: 'WOMEN' }));
    expect(toast()).toBeNull();
});

test('className · aria-label 등 나머지 속성을 그대로 링크에 전달한다', () => {
    render(
        <ComingSoonProvider>
            <NavLink href="/search" aria-label="검색" className="size-7">
                <span>아이콘</span>
            </NavLink>
        </ComingSoonProvider>,
    );

    const link = screen.getByRole('link', { name: '검색' });
    expect(link.className).toBe('size-7');
    expect(link.textContent).toBe('아이콘');
});

test('넘겨준 onClick 은 그대로 호출한다', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
        <ComingSoonProvider>
            <NavLink href="/women" onClick={onClick}>
                WOMEN
            </NavLink>
        </ComingSoonProvider>,
    );

    await user.click(screen.getByRole('link', { name: 'WOMEN' }));
    expect(onClick).toHaveBeenCalledTimes(1);
});

test('Provider 밖에서는 막지 않는다 (이동한 뒤 준비 중 페이지가 받는다)', async () => {
    const user = userEvent.setup();
    render(<NavLink href="/women">WOMEN</NavLink>);

    await user.click(screen.getByRole('link', { name: 'WOMEN' }));
    expect(lastClickPrevented).toBe(false);
    expect(toast()).toBeNull();
});
