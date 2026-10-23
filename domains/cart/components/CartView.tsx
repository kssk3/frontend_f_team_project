// 장바구니 화면 고르기 : 담긴 상품이 없으면 빈 화면, 있으면 목록 화면
'use client';

import { useCallback, useEffect, useRef } from 'react';
import EmptyCart from './EmptyCart';
import NotEmptyCart from './NotEmptyCart';
import type { CartItem } from '../types/types';

interface CartViewProps {
    items: CartItem[];
    isLoggedIn: boolean;
}

export default function CartView({ items, isLoggedIn }: CartViewProps): React.JSX.Element {
    const restoreRequested = useRef<Set<string> | null>(null);
    const selectionControl = useRef<HTMLInputElement>(null);
    const continueShopping = useRef<HTMLAnchorElement>(null);
    const restoreFocus = useCallback(() => {
        const requested = restoreRequested.current;
        const rowsReconciled = requested && [...requested].some((id) => !items.some((item) => item.id === id));
        const target = items.length ? selectionControl.current : continueShopping.current;
        if (rowsReconciled && target?.isConnected && !('disabled' in target && target.disabled)) {
            target.focus();
            restoreRequested.current = null;
        }
    }, [items]);

    // Keep the intent here: the list unmounts when its final row is removed.
    useEffect(restoreFocus, [items, restoreFocus]);

    if (items.length === 0) {
        return <EmptyCart isLoggedIn={isLoggedIn} continueShoppingRef={continueShopping} />;
    }
    return (
        <NotEmptyCart
            items={items}
            isLoggedIn={isLoggedIn}
            selectionControlRef={selectionControl}
            onRemovalStart={(ids) => { restoreRequested.current = new Set(ids); }}
            onRemovalEnd={(removedIds) => {
                if (restoreRequested.current) {
                    restoreRequested.current = removedIds.length ? new Set(removedIds) : null;
                }
            }}
            onRemovalSettled={restoreFocus}
        />
    );
}

// 장바구니를 불러오는 동안 보여 줄 자리
export function CartLoading(): React.JSX.Element {
    return (
        <main className="flex min-h-[600px] items-center justify-center">
            <p className="text-faint font-medium">장바구니를 불러오는 중입니다…</p>
        </main>
    );
}
