// 장바구니 목록 조회 : 회원은 cart_items, 비회원은 브라우저에 담긴 옵션 id 로 상품 정보를 가져온다
import 'server-only';

import { createServerClient } from '@/shared/lib/supabase';
import type { CartItem, CartOptionRow, GuestCartItem } from '../types/types';
import { toCartItem } from '../utils/cartItem.utils';

// 옵션 → 상품 → 브랜드·이미지까지 한 번에 가져오는 select 문자열
const OPTION_SELECT = `
    id, size, extra_price, stock,
    products (
        id, name, base_price, sale_price, delivery_type, delivery_fee,
        brands ( name ),
        product_images ( image_url, sort_order, is_thumbnail, deleted_at )
    )
`;

type MemberCartRow = {
    id: string;
    quantity: number;
    product_options: CartOptionRow | null;
};

// 회원 장바구니 (최근에 담은 순)
export async function getMemberCartItems(userId: string): Promise<CartItem[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('cart_items')
        .select(`id, quantity, product_options ( ${OPTION_SELECT} )`)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .overrideTypes<MemberCartRow[], { merge: false }>();

    if (error) throw error;

    return data.flatMap((row) => {
        const item = row.product_options
            ? toCartItem(row.id, row.quantity, row.product_options)
            : null;
        return item ? [item] : [];
    });
}

// 비회원 장바구니 (브라우저에 담긴 순서 그대로)
export async function getGuestCartItems(items: GuestCartItem[]): Promise<CartItem[]> {
    if (items.length === 0) return [];

    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('product_options')
        .select(OPTION_SELECT)
        .in('id', items.map((it) => it.optionId))
        .is('deleted_at', null)
        .overrideTypes<CartOptionRow[], { merge: false }>();

    if (error) throw error;

    const optionById = new Map(data.map((option) => [option.id, option]));

    return items.flatMap((it) => {
        const option = optionById.get(it.optionId);
        // 비회원은 cart_items 줄이 없으므로 옵션 id 를 그대로 id 로 쓴다
        const item = option ? toCartItem(it.optionId, it.quantity, option) : null;
        return item ? [item] : [];
    });
}
