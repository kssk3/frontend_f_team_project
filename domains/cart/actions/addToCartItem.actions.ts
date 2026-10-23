'use server';

// SSR 객체
import { createServerClient } from '@/shared/lib/supabase';

// 데이터 타입
import { type ActionState } from '@/shared/types/action.types';

// 검증 - 입력값 형식
import { validateCartInput } from '../utils/cartValidation';

// 조회
import { getProductStock } from '../queries/getProductStocks.query'; // 상품 옵션의 재고조회
import { getCartItemByOption } from '../queries/getCartItemByOption.query'; // 이미 담긴 옵션이 있는지 확인

// 화면 새로고침
import { revalidatePath } from 'next/cache';


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
        // 비회원 → DB에는 저장하지 않음 (AddToCartForm 이 이 문구를 보고 브라우저 장바구니에 담는다)
        return {
            success: false,
            message: '로그인 후 이용해 주세요.',
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

    // 5) 이미 장바구니에 담긴 옵션인지 조회
    const cartItem = await getCartItemByOption(user.id, optionId);

    // 담은 뒤의 총 수량 = 기존 수량 + 새로 담을 수량
    const totalQuantity = (cartItem?.quantity ?? 0) + quantity;

    // ② 담은 뒤의 총 수량이 재고보다 많으면
    if (totalQuantity > stock) {
        return {
            success: false,
            message: `재고 수량이 부족합니다. 남은수량 : ${stock}개 입니다.`,
        };
    }

    // 6) DB에 장바구니 데이터 저장
    if (cartItem) {
        // 이미 담긴 옵션 → 수량만 수정
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: totalQuantity, updated_at: new Date().toISOString() })
            .eq('id', cartItem.id);

        if (error) {
            console.error('[cart] 장바구니 수량 수정 실패', error.code, error.message);
            return { success: false, message: '장바구니 담기에 실패했습니다.' };
        }
    } else {
        // 처음 담는 옵션 → 새 줄 추가
        const { error } = await supabase
            .from('cart_items')
            .insert({ user_id: user.id, option_id: optionId, quantity: quantity, is_checked: true });

        if (error) {
            // 42501 이면 cart_items 권한 규칙이 없는 것 → db/migrations/20261022_cart_items_rls.sql 실행
            console.error('[cart] 장바구니 추가 실패', error.code, error.message);
            return { success: false, message: '장바구니 담기에 실패했습니다.' };
        }
    }

    // 7) 장바구니 화면을 최신 데이터로 다시 그리기
    revalidatePath('/cart');
    return { success: true, message: '장바구니에 담았습니다.' };
}
