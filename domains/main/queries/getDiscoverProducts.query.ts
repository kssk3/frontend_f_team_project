// 메인 DISCOVER 카드에 쓸 DB 상품 조회 (서버에서만 실행)
// 'use server' 를 붙이면 브라우저가 부를 수 있는 서버 액션이 되므로, 조회 함수는 server-only 로 막는다
import 'server-only';

import { createServerClient } from '@/shared/lib/supabase';

import type { DiscoverItem } from '../types';
import {
    toDiscoverItem,
    type DiscoverProductRow,
} from '../utils/discoverItems';

export const DISCOVER_PRODUCT_LIMIT = 10;

// 삭제되지 않은 상품을 id 순으로 가져와 카드로 바꾼다.
// 조회에 실패하면 빈 목록을 돌려줘 메인이 깨지지 않게 한다 (DISCOVER 영역만 빠짐)
export async function getDiscoverProducts(): Promise<DiscoverItem[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('products')
        .select(
            'id, name, category, brands ( name ), product_images ( image_url, alt, sort_order )',
        )
        .is('deleted_at', null)
        .is('product_images.deleted_at', null)
        .order('id')
        // sort_order 가 같은 사진이 있어도 매번 같은 사진이 대표가 되도록 사진 id 로 한 번 더 정렬
        .order('sort_order', { referencedTable: 'product_images' })
        .order('id', { referencedTable: 'product_images' })
        .limit(DISCOVER_PRODUCT_LIMIT);

    if (error) {
        console.error('[discover] products failed:', error.code);
        return [];
    }

    return ((data ?? []) as unknown as DiscoverProductRow[]).map(
        toDiscoverItem,
    );
}
