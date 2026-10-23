// 예전 시안 주소 → 실제 장바구니(/cart)로 이동
import { redirect } from 'next/navigation';

export default function NotEmptyCartPage(): never {
    redirect('/cart');
}
