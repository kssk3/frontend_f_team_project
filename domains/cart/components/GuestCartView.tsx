// 비회원 장바구니 화면 : 브라우저(zustand)에 담긴 옵션으로 상품 정보를 불러와 보여 준다
'use client';

import CartView, { CartLoading } from './CartView';
import { useGuestCartItems } from './useGuestCartItems';
import CartError from './CartError';

export default function GuestCartView(): React.JSX.Element {
    const cart = useGuestCartItems();
    if (cart.status === 'loading') return <CartLoading />;
    if (cart.status === 'error') return <CartError onRetry={cart.retry} />;
    return <CartView items={cart.items} isLoggedIn={false} />;
}
