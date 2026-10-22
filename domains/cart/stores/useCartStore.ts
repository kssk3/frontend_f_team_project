// 공통 저장소 : 비회원 장바구니 (브라우저 localStorage에 기억)
'use client' ;

import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartStore } from '../types/types';


export const useCartStore = create<CartStore>()(persist(immer((set) => ({
    // 담긴 상품 목록 (optionID + quantity)
    items: [],

    // localStorage에서 다 읽어 왔는지
    _hasHydrated: false,
    setHasHydrated: (state: boolean) => {
        set((_state) => {_state._hasHydrated = state});
    },

    // 담기 : 없으면 추가, 이미 있으면 수량 더하기
    add: (optionID: string, quantity: number) => {
        set((state) => {
            const found = state.items.find((it) => it.optionId === optionID);

            if (found) {
                found.quantity = Math.min(found.quantity + quantity, 99); // 최대 
            } else {
                state.items.push({ optionId: optionID, quantity });  
            }
        });
    },

    // 삭제
    remove: (optionId: string) => {
        set((state) => {
            const index = state.items.findIndex((it) => it.optionId === optionId);

            if (index !== -1) { // -1은 못 찾은 경우
                state.items.splice(index, 1);
            }
        });
    },

    // 수량 변경 (장바구니 페이지의 + / - 버튼)
    changeQuantity: (optionId: string, quantity: number) => {
        set((state) => {
            const found = state.items.find((it) => it.optionId === optionId);

            if (found) {
                found.quantity = quantity;
            }
        });
    },

    // 전체 비우기 (로그인 후 DB로 옮긴 다음)
    clear: () => {
        set((state) => { state.items = [] });
    },

  })),

  {
    name: 'guest-cart-storage',
    partialize: (state) => ({ items: state.items }),
    onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // 하이드레이션 완료
    },
  }
));