// 장바구니에 상품이 있을 때 화면

import Link from 'next/link';
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표
import { IoMdInformationCircleOutline } from 'react-icons/io'; // info 표시
import { AiOutlineExclamationCircle } from 'react-icons/ai'; // 느낌표
import { RxDividerVertical } from 'react-icons/rx'; // | 구분선

import CheckoutStep from './CheckoutStep';
import CartProductItem from './CartProductItem';
import RecommendProductCard from './RecommendProductCard';
import type { CartItem } from '../types/types';
import { FREE_DELIVERY_PRICE, formatPrice, summarizeCart } from '../utils/cartItem.utils';

interface NotEmptyCartProps {
    items: CartItem[];
    isLoggedIn: boolean;
}

export default function NotEmptyCart({ items, isLoggedIn }: NotEmptyCartProps): React.JSX.Element {
    const summary = summarizeCart(items);

    return (
        <main>
            <div className="mx-[206px] pt-[100px] pb-[300px]">
                {/* ① 단계 표시 영역 */}
                <div className="mb-[60px]">
                    <CheckoutStep currentStep={0} />
                </div>

                {/* ② 비로그인 시 로그인 유도 영역 */}
                {!isLoggedIn && (
                    <div className="mb-[60px] flex justify-between border border-black p-[30px]">
                        <Link href="/login?redirectUrl=/cart">
                            <div className="flex items-center text-[16px] font-medium">
                                로그인 후 더 많은 혜택을 받으세요
                                <GoChevronRight />
                            </div>
                        </Link>

                        <div className="text-faint flex items-center gap-1 text-[13px] font-medium">
                            <IoMdInformationCircleOutline />
                            로그인을 하시면 장바구니에 담긴 상품을 나중에도 확인하실 수 있습니다.
                        </div>
                    </div>
                )}

                {/* 좌우 구조 나누기 */}
                <div className="flex items-start gap-[70px]">
                    {/* ③ 왼쪽 화면 - 상품목록 */}
                    <div className="flex-1">
                        {/* 전체 | 선택 삭제 & 품절 삭제 */}
                        <div className="flex items-center justify-between border-b border-black pb-[20px]">
                            <label className="flex items-center gap-2 font-medium">
                                <input type="checkbox" defaultChecked />
                                <span>전체</span>
                            </label>

                            <div className="flex items-center justify-center gap-2 font-medium">
                                <button type="button">선택 삭제</button>
                                <RxDividerVertical />
                                <button type="button">품절 삭제</button>
                            </div>
                        </div>

                        {/* 배송 그룹별 상품 목록 */}
                        {summary.groups.map((group) => (
                            <section key={group.key} className="border-b border-black">
                                {/* 배송 타입 + 업체명 */}
                                <h3 className="mt-[30px] text-[14px] font-semibold">
                                    [{group.deliveryType}] {group.brandName}
                                </h3>

                                <ul className="border-secondary flex flex-col gap-[30px] border-b pt-[20px] pb-[30px]">
                                    {group.items.map((item) => (
                                        <CartProductItem key={item.id} item={item} />
                                    ))}
                                </ul>

                                {/* 그룹 결제 금액 */}
                                <div className="flex items-center justify-center gap-1 py-[30px] text-[16px] font-medium">
                                    <span>{formatPrice(group.productTotal)}원 + </span>
                                    <span>배송비 {formatPrice(group.deliveryFee)}원 = </span>
                                    <span>{formatPrice(group.productTotal + group.deliveryFee)}원</span>

                                    {/* 배송비 안내 툴팁 */}
                                    <button type="button" className="group relative" aria-label="배송비 안내">
                                        <div className="text-faint">
                                            <AiOutlineExclamationCircle />
                                        </div>

                                        <span className="absolute top-full left-1/2 mt-2 hidden -translate-x-1/2 rounded border border-black bg-white px-[30px] py-[20px] text-[14px] whitespace-nowrap group-hover:block group-focus:block">
                                            {group.deliveryFee === 0
                                                ? `[${group.deliveryType}] 무료배송`
                                                : `[${group.deliveryType}] ${formatPrice(FREE_DELIVERY_PRICE)}원 미만 결제 시 배송비 ${formatPrice(group.deliveryFee)}원`}
                                        </span>
                                    </button>
                                </div>
                            </section>
                        ))}

                        {/* 안내문구 */}
                        <p className="text-subtle flex items-center gap-1 pt-[30px] text-[13px]">
                            <IoMdInformationCircleOutline />
                            판매 종료된 상품은 장바구니에서 자동 삭제됩니다.
                        </p>

                        {/* 추천 영역 */}
                        <section className="mt-[120px]">
                            <h2 className="mb-[20px] text-[18px] font-bold">함께 구매하면 좋은 상품</h2>

                            <ul className="grid grid-cols-4 gap-[15px]">
                                <RecommendProductCard />
                                <RecommendProductCard />
                                <RecommendProductCard />
                            </ul>
                        </section>
                    </div>

                    {/* ④ 오른쪽 화면 - 결제정보 */}
                    <div className="border border-x-[0.7px]">
                        <div className="px-[30px] pt-[30px] pb-[90px]">
                            <div className="border-b border-black pb-[20px] text-[18px] font-bold">결제 정보</div>

                            {/* 총 결제금액 */}
                            <dl className="mt-[45px] grid grid-cols-2 gap-y-3 border-b pb-[20px] text-[16px]">
                                <dt className="font-bold">총 결제 금액</dt>
                                <dd className="text-right">{formatPrice(summary.totalPrice)}원</dd>
                            </dl>

                            {/* 금액 상세 정보 */}
                            <dl className="text-faint mt-[15px] grid grid-cols-2 gap-y-3 text-[14px] font-semibold">
                                <dt>총 상품 금액</dt>
                                <dd className="text-right">{formatPrice(summary.totalProduct)}원</dd>
                                <dt>총 배송비</dt>
                                <dd className="text-right">{formatPrice(summary.totalDelivery)}원</dd>
                                <dt>총 할인 금액</dt>
                                <dd className="text-right">{formatPrice(summary.totalDiscount)}원</dd>
                            </dl>
                        </div>

                        {/* 하단 : 총 개수와 주문하기 버튼 */}
                        <div className="flex border-t">
                            <div className="flex flex-1 items-center px-[45px]">총 {summary.totalCount}개</div>
                            <button
                                type="button"
                                disabled={summary.totalCount === 0}
                                className="h-[90px] w-[300px] bg-black font-bold text-white disabled:bg-gray-300"
                            >
                                {formatPrice(summary.totalPrice)}원 주문하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
