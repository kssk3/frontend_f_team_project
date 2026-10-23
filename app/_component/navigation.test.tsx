import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps, ReactNode } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { Search } from 'lucide-react';

import ComingSoonProvider, {
    COMING_SOON_MESSAGE,
} from '@/shared/components/ComingSoonProvider';
import NotFound from '@/app/not-found';
import HelpLnb from '@/app/(shop)/help/_component/HelpLnb';
import MainBanner from '@/domains/main/components/MainBanner';
import { mockBanners } from '@/domains/main/data/mockBanners';
import Footer from './Footer';
import GnbMenu from './gnb/GnbMenu';
import GnbPanel from './gnb/GnbPanel';
import { gnbMenus } from './gnb/gnbMenus';

// Header.tsx 는 로그인 확인(쿠키)을 하는 서버 컴포넌트를 불러오므로 그 부분만 막는다
vi.mock('./AuthMenu', () => ({ default: () => null }));
vi.mock('./CartMenu', () => ({ default: () => null }));
vi.mock('server-only', () => ({}));

// Next 라우터·이미지 최적화 없이 링크 동작만 보기 위해 일반 태그로 바꾼다
vi.mock('next/link', () => ({
    default: ({
        href,
        prefetch,
        ...rest
    }: ComponentProps<'a'> & { prefetch?: boolean | null }) => (
        <a href={href} data-prefetch={String(prefetch)} {...rest} />
    ),
}));
vi.mock('next/image', () => ({
    default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
vi.mock('next/navigation', () => ({ usePathname: () => '/help/vendor' }));

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
    vi.unstubAllGlobals();
});

// 준비 중 안내 토스트 (닫혀 있으면 aria-hidden 이라 null)
const toast = () => screen.queryByRole('status', { name: '준비 중 안내' });

function renderWithProvider(ui: ReactNode) {
    return render(<ComingSoonProvider>{ui}</ComingSoonProvider>);
}

async function expectComingSoonAfterClick(link: HTMLElement) {
    await userEvent.setup().click(link);
    expect(lastClickPrevented).toBe(true);
    expect(toast()?.textContent).toContain(COMING_SOON_MESSAGE);
}

async function expectNavigationAfterClick(link: HTMLElement) {
    await userEvent.setup().click(link);
    expect(lastClickPrevented).toBe(false);
    expect(toast()).toBeNull();
}

test('헤더 메뉴: 아직 없는 WOMEN 은 준비 중 안내를 띄운다', async () => {
    renderWithProvider(<GnbMenu />);
    await expectComingSoonAfterClick(
        screen.getByRole('link', { name: 'WOMEN' }),
    );
});

test('드롭다운: 하위 카테고리와 배너도 준비 중 안내를 띄운다', async () => {
    const panel = gnbMenus[0].panel!;
    renderWithProvider(<GnbPanel panel={panel} />);

    await expectComingSoonAfterClick(
        screen.getByRole('link', { name: '아우터' }),
    );
    await userEvent.setup().click(screen.getByRole('button', { name: '확인' }));

    await expectComingSoonAfterClick(
        screen.getByRole('link', { name: new RegExp(panel.banners[0].title) }),
    );
});

test('드롭다운에서 메뉴를 고르면 패널을 닫는다 (열린 패널이 안내를 가리지 않게)', async () => {
    const user = userEvent.setup();
    renderWithProvider(<GnbMenu />);

    await user.hover(screen.getByRole('link', { name: 'WOMEN' }));
    await user.click(await screen.findByRole('link', { name: '아우터' }));

    expect(toast()).not.toBeNull();
    // hidden 요소까지 찾아서 패널이 화면에서 정말 사라졌는지 본다
    expect(
        screen.queryByRole('link', { name: '아우터', hidden: true }),
    ).toBeNull();
});

test('오른쪽 아이콘: 검색은 준비 중, 로그인은 그대로 이동', async () => {
    const { UtilItem } = await import('./Header');
    renderWithProvider(
        <ul>
            <UtilItem href="/search" label="검색" icon={Search} />
            <UtilItem href="/login" label="로그인" icon={Search} />
        </ul>,
    );

    await expectNavigationAfterClick(
        screen.getByRole('link', { name: '로그인' }),
    );
    await expectComingSoonAfterClick(
        screen.getByRole('link', { name: '검색' }),
    );
});

test('푸터: FAQ 는 준비 중, 입점 문의는 그대로 이동', async () => {
    renderWithProvider(<Footer />);
    const footer = screen.getByRole('contentinfo');

    await expectNavigationAfterClick(
        within(footer).getByRole('link', { name: '입점 및 매장 대관 문의' }),
    );
    await expectComingSoonAfterClick(
        within(footer).getByRole('link', { name: 'FAQ' }),
    );
});

test('CS CENTER 메뉴: FAQ 는 준비 중, 입점 문의는 그대로 이동', async () => {
    renderWithProvider(<HelpLnb />);
    const nav = screen.getByRole('navigation', { name: '고객센터 메뉴' });

    await expectNavigationAfterClick(
        within(nav).getByRole('link', { name: '입점 및 매장 대관 문의' }),
    );
    await expectComingSoonAfterClick(
        within(nav).getByRole('link', { name: 'FAQ' }),
    );
});

test('메인 배너: 아직 없는 이벤트 페이지는 준비 중 안내를 띄운다', async () => {
    // 슬라이드(Swiper)가 쓰는 ResizeObserver 는 jsdom 에 없어서 빈 것으로 채운다
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    renderWithProvider(<MainBanner />);

    await expectComingSoonAfterClick(
        screen.getAllByRole('link', { name: mockBanners[0].alt })[0],
    );
});

test('주소를 직접 입력해 없는 페이지로 오면 안내와 메인으로 가는 링크를 보여 준다', () => {
    render(<NotFound />);

    expect(
        screen.getByRole('heading', {
            name: '찾을 수 없거나 아직 준비 중인 페이지입니다.',
        }),
    ).toBeTruthy();
    expect(
        screen.getByRole('link', { name: '메인으로' }).getAttribute('href'),
    ).toBe('/');
});
