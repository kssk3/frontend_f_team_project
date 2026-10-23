// 예전 시안 주소 → 실제 장바구니(/cart)로 이동 (헤더의 장바구니 링크가 아직 이 주소를 가리킴)
import { redirect } from 'next/navigation';

export default function EmptyCartPage(): never {
    redirect('/cart');
}
