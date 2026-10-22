import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import type { DiscoverItem } from '../types';

const getDiscoverProducts = vi.hoisted(() => vi.fn());
vi.mock('../queries/getDiscoverProducts.query', () => ({
    getDiscoverProducts,
}));
vi.mock('next/server', () => ({ connection: vi.fn(async () => {}) }));
vi.mock('next/image', () => ({
    default: ({ alt, src }: { alt: string; src: string }) => (
        <span role="img" aria-label={alt} data-src={src} />
    ),
}));

import DiscoverSection from './DiscoverSection';
import DiscoverSkeleton from './DiscoverSkeleton';

beforeEach(() => {
    // 슬라이드(Swiper)가 쓰는 ResizeObserver 는 jsdom 에 없어서 빈 것으로 채운다
    vi.stubGlobal(
        'ResizeObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
});
afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    getDiscoverProducts.mockReset();
});

const trench: DiscoverItem = {
    productId: 'a0000000-0000-4000-8000-000000000001',
    title: '클래식 더블 트렌치코트',
    subtitle: 'Style #트렌치',
    tags: ['MONO STUDIO'],
    image: 'https://picsum.photos/seed/eql-trench-1/900/1200',
    alt: '트렌치코트 정면',
};

test('DB 상품으로 카드를 그린다: 상품명 · 분류 · 브랜드 · 대표 사진 · 상세 링크', async () => {
    getDiscoverProducts.mockResolvedValue([trench]);

    render((await DiscoverSection())!);

    const card = screen.getByRole('link', { name: /클래식 더블 트렌치코트/ });
    expect(card.getAttribute('href')).toBe(`/product/${trench.productId}`);
    expect(within(card).getByText('Style #트렌치')).toBeTruthy();
    expect(within(card).getByText('MONO STUDIO')).toBeTruthy();
    expect(
        within(card).getByRole('img', { name: '트렌치코트 정면' }).dataset.src,
    ).toBe(trench.image);
});

test('보여 줄 상품이 없으면 DISCOVER 영역을 그리지 않는다', async () => {
    getDiscoverProducts.mockResolvedValue([]);

    expect(await DiscoverSection()).toBeNull();
});

test('불러오는 동안은 mock 없이 회색 카드 자리만 보여 준다', () => {
    const { container } = render(<DiscoverSkeleton />);

    expect(screen.queryByRole('link')).toBeNull();
    expect(container.querySelectorAll('[data-skeleton-card]').length).toBe(5);
});
