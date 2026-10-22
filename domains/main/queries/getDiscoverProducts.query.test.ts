import { afterEach, beforeEach, expect, test, vi } from 'vitest';

// server-only 는 서버 번들에서만 불러올 수 있어서 테스트에서는 빈 모듈로 바꾼다
vi.mock('server-only', () => ({}));

// Supabase 조회 체인(from → select → is → order → limit)을 기록하고 결과를 돌려주는 가짜
const supabase = vi.hoisted(() => {
    const calls: [string, unknown[]][] = [];
    let result: { data: unknown; error: unknown } = { data: [], error: null };
    const builder: Record<string, unknown> = {};
    for (const method of ['from', 'select', 'is', 'order', 'limit']) {
        builder[method] = (...args: unknown[]) => {
            calls.push([method, args]);
            return builder;
        };
    }
    builder.then = (resolve: (value: unknown) => unknown) => resolve(result);
    return {
        calls,
        client: builder,
        setResult: (next: typeof result) => {
            result = next;
        },
    };
});
vi.mock('@/shared/lib/supabase', () => ({
    createServerClient: () => supabase.client,
}));

import {
    DISCOVER_PRODUCT_LIMIT,
    getDiscoverProducts,
} from './getDiscoverProducts.query';

beforeEach(() => {
    supabase.calls.length = 0;
    supabase.setResult({ data: [], error: null });
});
afterEach(() => {
    vi.restoreAllMocks();
});

test('삭제되지 않은 상품을 id 순으로 정해진 개수만큼 조회해 카드로 돌려준다', async () => {
    supabase.setResult({
        data: [
            {
                id: 'p1',
                name: '요즘 니트',
                category: 'Style #니트',
                brands: { name: 'KNIT LAB' },
                product_images: [
                    { image_url: 'knit-1', alt: '니트 착용 컷', sort_order: 0 },
                ],
            },
        ],
        error: null,
    });

    const items = await getDiscoverProducts();

    expect(items).toEqual([
        {
            productId: 'p1',
            title: '요즘 니트',
            subtitle: 'Style #니트',
            tags: ['KNIT LAB'],
            image: 'knit-1',
            alt: '니트 착용 컷',
        },
    ]);
    expect(supabase.calls).toContainEqual(['from', ['products']]);
    expect(supabase.calls).toContainEqual(['is', ['deleted_at', null]]);
    expect(supabase.calls).toContainEqual([
        'is',
        ['product_images.deleted_at', null],
    ]);
    expect(supabase.calls).toContainEqual(['order', ['id']]);
    expect(supabase.calls).toContainEqual(['limit', [DISCOVER_PRODUCT_LIMIT]]);
});

test('조회에 실패해도 오류를 던지지 않고 빈 목록을 돌려준다 (메인이 깨지지 않게)', async () => {
    const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    supabase.setResult({ data: null, error: { code: 'PGRST301' } });

    await expect(getDiscoverProducts()).resolves.toEqual([]);
    expect(consoleError).toHaveBeenCalledWith(
        '[discover] products failed:',
        'PGRST301',
    );
});
