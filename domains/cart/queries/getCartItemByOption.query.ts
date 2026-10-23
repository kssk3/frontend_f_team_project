'use server';
// 회원 장바구니에 같은 옵션이 이미 담겨 있는지 조회

import { createServerClient } from "@/shared/lib/supabase";
//
export async function getCartItemByOption(
    userID: string,
    optionID: string,
) : Promise< {id: string; quantity: number} | null> {

    // 1) supabase 접근 객체 만들기
    const supabase = createServerClient();

    // 2) cart_items 테이블에서 조회
    const { data: cartItem, error } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userID)
        .eq('option_id', optionID)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) throw error;

    // 3) 결과 돌려주기
    return cartItem;
}
