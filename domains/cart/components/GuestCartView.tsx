// 비회원 장바구니 화면 : 브라우저(zustand)에 담긴 옵션으로 상품 정보를 불러와 보여 준다
'use client';

import { useEffect, useState } from 'react';

import CartView, { CartLoading } from './CartView';
import { useCartStore } from '../stores/useCartStore';
import { fetchGuestCartItems } from '../actions/getGuestCartItems.actions';
import type { CartItem, GuestCartItem } from '../types/types';

export default function GuestCartView(): React.JSX.Element {
    const items = useCartStore((state) => state.items);
    const hasHydrated = useCartStore((state) => state._hasHydrated);

    // 어떤 목록(items)을 불러온 결과인지 함께 기억 → 목록이 바뀌면 다시 불러오는 중으로 보임
    const [loaded, setLoaded] = useState<{ source: GuestCartItem[]; cartItems: CartItem[] } | null>(null);

    useEffect(() => {
        if (!hasHydrated || items.length === 0) return;

        let ignore = false;
        fetchGuestCartItems(items)
            .then((cartItems) => {
                if (!ignore) setLoaded({ source: items, cartItems });
            })
            .catch(() => {
                if (!ignore) setLoaded({ source: items, cartItems: [] });
            });

        return () => {
            ignore = true;
        };
    }, [hasHydrated, items]);

    // 브라우저 저장소를 아직 다 읽지 못함
    if (!hasHydrated) return <CartLoading />;

    // 담긴 상품 없음
    if (items.length === 0) return <CartView items={[]} isLoggedIn={false} />;

    // 상품 정보를 불러오는 중
    if (loaded?.source !== items) return <CartLoading />;

    return <CartView items={loaded.cartItems} isLoggedIn={false} />;
}
