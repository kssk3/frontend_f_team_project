import { cleanup, render, screen } from '@testing-library/react';
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
