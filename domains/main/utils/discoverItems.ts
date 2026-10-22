import type { DiscoverItem } from '../types';

// DISCOVER 조회 결과 한 줄 (products + brands + product_images)
export type DiscoverProductRow = {
    id: string;
    name: string;
    category: string;
    brands: { name: string } | null;
    product_images: {
        image_url: string;
        alt: string | null;
        sort_order: number;
    }[];
};

// DB 상품 한 줄을 카드로 바꾼다.
// 대표 사진은 sort_order 가 가장 작은 것 — 같으면 먼저 온 것 (조회할 때 정한 순서를 따름)
export function toDiscoverItem(row: DiscoverProductRow): DiscoverItem {
    const cover = row.product_images.reduce<
        DiscoverProductRow['product_images'][number] | undefined
    >(
        (best, image) =>
            !best || image.sort_order < best.sort_order ? image : best,
        undefined,
    );

    return {
        productId: row.id,
        title: row.name,
        subtitle: row.category,
        tags: row.brands ? [row.brands.name] : [],
        image: cover?.image_url ?? '',
        alt: cover?.alt ?? row.name,
    };
}
