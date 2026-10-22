// 장바구니 페이지 : 회원은 DB(cart_items), 비회원은 브라우저(zustand)에 담긴 상품을 보여 준다
import { Suspense } from 'react';
import { connection } from 'next/server';

import { createServerClient } from '@/shared/lib/supabase';
import CartView, { CartLoading } from '@/domains/cart/components/CartView';
import GuestCartView from '@/domains/cart/components/GuestCartView';
import { getMemberCartItems } from '@/domains/cart/queries/getCartItems.query';

export default function CartPage(): React.JSX.Element {
    return (
        <Suspense fallback={<CartLoading />}>
            <CartContent />
        </Suspense>
    );
}

async function CartContent(): Promise<React.JSX.Element> {
    // 로그인 정보(쿠키)를 읽으므로 요청마다 새로 그린다
    await connection();

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 비회원 → 브라우저에 담긴 장바구니
    if (!user) return <GuestCartView />;

    // 회원 → DB 장바구니
    const items = await getMemberCartItems(user.id);
    return <CartView items={items} isLoggedIn />;
}
