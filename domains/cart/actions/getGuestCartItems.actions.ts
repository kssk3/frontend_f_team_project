'use server';

// 비회원 장바구니 상품 정보 조회 : 브라우저(zustand)에 담긴 옵션 id·수량을 받아 화면용 데이터로 돌려준다

import type { CartItem, GuestCartItem } from '../types/types';
import { getGuestCartItems } from '../queries/getCartItems.query';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ITEMS = 50;

export async function fetchGuestCartItems(items: GuestCartItem[]): Promise<CartItem[]> {
    // 브라우저에서 온 값이라 모양을 다시 확인한다 (잘못된 값은 버림)
    const safeItems = Array.isArray(items)
        ? items
              .filter(
                  (it) =>
                      typeof it?.optionId === 'string' &&
                      UUID.test(it.optionId) &&
                      Number.isInteger(it.quantity) &&
                      it.quantity >= 1 &&
                      it.quantity <= 99,
              )
              .slice(0, MAX_ITEMS)
        : [];

    return getGuestCartItems(safeItems);
}
