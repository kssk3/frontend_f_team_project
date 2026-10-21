// 상품 옵션 재고 조회

import { createServerClient } from '@/shared/lib/supabase';

// 상품-옵션의 재고 수량을 돌려줌 (없는 옵션이면 null)
export async function getProductStock(
    optionID: string,
): Promise<number | null> {
    // 1) supabase 접근 객체 만들기
    const supabase = createServerClient();

    // 2) product_options 테이블의 stock 컬럼 데이터 조회
    const { data: option } = await supabase
        .from('product_options')
        .select('stock')
        .eq('id', optionID) // 테이블의 id컬럼과 optionID가 같은것
        .is('deleted_at', null) // 삭제날짜가 null인것
        .maybeSingle();

    // 3) 만약, data : option이 없다면 null을 반환하도록
    if (!option) {
        return null;
    }

    // 4) 결과값 - option 데이터 안에 stock 값을 반환
    return option.stock;
}
