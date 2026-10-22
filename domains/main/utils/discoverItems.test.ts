import { expect, test } from 'vitest';

import { toDiscoverItem, type DiscoverProductRow } from './discoverItems';

const row = (
    overrides: Partial<DiscoverProductRow> = {},
): DiscoverProductRow => ({
    id: 'a0000000-0000-4000-8000-000000000001',
    name: '클래식 더블 트렌치코트',
    category: 'Style #트렌치',
    brands: { name: 'MONO STUDIO' },
    product_images: [
        { image_url: 'trench-back', alt: '뒷면', sort_order: 1 },
        { image_url: 'trench-front', alt: '정면', sort_order: 0 },
    ],
    ...overrides,
});

test('DB 상품 한 줄을 카드로 바꾼다: 제목=상품명, 부제=분류, 태그=브랜드, 이미지=대표 사진', () => {
    expect(toDiscoverItem(row())).toEqual({
        productId: 'a0000000-0000-4000-8000-000000000001',
        title: '클래식 더블 트렌치코트',
        subtitle: 'Style #트렌치',
        tags: ['MONO STUDIO'],
        image: 'trench-front',
        alt: '정면',
    });
});

test('sort_order 가 같으면 먼저 온 사진을 대표로 쓴다 (조회 순서를 따름)', () => {
    const item = toDiscoverItem(
        row({
            product_images: [
                { image_url: 'first', alt: null, sort_order: 0 },
                { image_url: 'second', alt: null, sort_order: 0 },
            ],
        }),
    );

    expect(item.image).toBe('first');
});

test('사진 설명(alt)이 없으면 상품명을 쓴다', () => {
    const item = toDiscoverItem(
        row({ product_images: [{ image_url: 'x', alt: null, sort_order: 0 }] }),
    );

    expect(item.alt).toBe('클래식 더블 트렌치코트');
});

test('사진이 없으면 이미지는 비워 두고(회색 상자), 브랜드가 없으면 태그도 비운다', () => {
    const item = toDiscoverItem(row({ product_images: [], brands: null }));

    expect(item.image).toBe('');
    expect(item.alt).toBe('클래식 더블 트렌치코트');
    expect(item.tags).toEqual([]);
});
