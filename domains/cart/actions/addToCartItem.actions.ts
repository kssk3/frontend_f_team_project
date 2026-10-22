'use server';

// SSR 객체
import { createServerClient } from '@/shared/lib/supabase';

// 데이터 타입
import { type CartInput } from '../types/types';
import { type ActionState } from '@/shared/types/action.types';

// 검증 - 입력값 형식
import { validateCartInput } from '../utils/cartValidation';

// 조회
import { getProductStock } from '../queries/getProductStocks.query'; // 상품 옵션의 재고조회
import { getCartItemByOption } from '../queries/getCartItemByOption.query'; // 이미 담긴 옵션이 있는지 확인

export async function addToCartItem(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    // 1) Form에서 값 꺼내기
    const optionId = String(formData.get('optionID') ?? '');
    const quantity = Number(formData.get('quantity'));

    // 2) 형식 검증 (cartValidation.ts) - 필드별 유효성 검사
    const errors = validateCartInput({
        optionID: optionId, // 옵션 ID가 비어있지 않은지
        quantity: quantity, // 1~99의 정수인지
    });

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    // 3) 로그인 확인 - 회원기준
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // 비회원의 장바구니 -> 쿠키에 저장 (회원 저장 완성 후 작성예정)
        return {
            success: false,
            message: '비회원의 장바구니 담기 기능은 구현 준비중입니다.',
        };
    }

    // 4) 상품 옵션 재고조회
    const stock = await getProductStock(optionId);

    //  ① 없는 옵션이면
    if (stock === null) {
        return {
            success: false,
            message: '존재하지 않는 상품입니다.',
        };
    }

    // ② 장바구니에 담을 수량이 재고보다 많으면
    if (quantity > stock) {
        return {
            success: false,
            message: `재고 수량이 부족합니다. 남은수량 : ${stock}개 입니다.`,
        };
    }

    // ) DB에 장바구니 데이터 저장
    return {
        success: true,
        message: '',
    };
}
