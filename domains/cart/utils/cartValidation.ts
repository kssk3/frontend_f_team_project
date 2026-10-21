// <장바구니 입력값 형식 검증>

import { type CartInput } from "../types/types" ; 

export function validateCartInput(input: CartInput): Record<string,string> {
    const errors: Record<string, string> = {};
    
    // 1) 옵션 id가 비어 있지 않은지
    if (!input.optionID) {
        errors.optionID = '옵션을 선택해 주세요.';
    }    

    // 2) 수량이 1~99 사이의 정수인지
    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
        errors.quantity = '수량은 1개 이상이어야 합니다.';
    } else if (input.quantity > 99) {
        errors.quantity = '수량은 최대 99개까지 담을 수 있습니다.'
    }

    return errors;
}
