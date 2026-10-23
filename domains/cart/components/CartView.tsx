// 장바구니 화면 고르기 : 담긴 상품이 없으면 빈 화면, 있으면 목록 화면

import EmptyCart from './EmptyCart';
import NotEmptyCart from './NotEmptyCart';
import type { CartItem } from '../types/types';

interface CartViewProps {
    items: CartItem[];
    isLoggedIn: boolean;
}

export default function CartView({ items, isLoggedIn }: CartViewProps): React.JSX.Element {
    if (items.length === 0) {
        return <EmptyCart isLoggedIn={isLoggedIn} />;
    }
    return <NotEmptyCart items={items} isLoggedIn={isLoggedIn} />;
}

// 장바구니를 불러오는 동안 보여 줄 자리
export function CartLoading(): React.JSX.Element {
    return (
        <main className="flex min-h-[600px] items-center justify-center">
            <p className="text-faint font-medium">장바구니를 불러오는 중입니다…</p>
        </main>
    );
}
