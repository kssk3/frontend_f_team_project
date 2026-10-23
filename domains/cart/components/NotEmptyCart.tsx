// 장바구니에 상품이 있을 때 화면
'use client';

import { useEffect, useRef, useState, useTransition, type Ref } from 'react';
import { useRouter } from 'next/navigation';
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
import { useCartStore } from '../stores/useCartStore';
import { removeCartItems } from '../actions/removeCartItem.actions';

interface NotEmptyCartProps {
    items: CartItem[];
    isLoggedIn: boolean;
    selectionControlRef: Ref<HTMLInputElement>;
    onRemovalStart: (ids: string[]) => void;
    onRemovalEnd: (removedIds: string[]) => void;
    onRemovalSettled: () => void;
}

export default function NotEmptyCart({
    items, isLoggedIn, selectionControlRef, onRemovalStart, onRemovalEnd, onRemovalSettled,
}: NotEmptyCartProps): React.JSX.Element {
    const router = useRouter();
    const removeGuestItems = useCartStore((state) => state.removeMany);
    const [selection, setSelection] = useState({
        source: items,
        ids: new Set(items.map((item) => item.id)),
    });
    const [message, setMessage] = useState('');
    const [pending, startTransition] = useTransition();
    const deleting = useRef(false);

    // A transition's finally runs before pending controls become enabled.
    useEffect(() => {
        if (!pending) onRemovalSettled();
    }, [pending, onRemovalSettled]);

    // Server refreshes replace props; retain only existing choices and select new rows.
    if (selection.source !== items) {
        const previousIds = new Set(selection.source.map((item) => item.id));
        setSelection({
            source: items,
            ids: new Set(items
                .filter((item) => selection.ids.has(item.id) || !previousIds.has(item.id))
                .map((item) => item.id)),
        });
    }
    const selected = items.filter((item) => selection.ids.has(item.id));
    const summary = summarizeCart(selected);
    const visibleGroups = summarizeCart(items).groups;
    const allChecked = selected.length === items.length;
    const soldOut = items.filter((item) => item.status === 'soldOut');
    const toggle = (id: string) => {
        setSelection((current) => {
            const ids = new Set(current.ids);
            if (ids.has(id)) ids.delete(id);
            else ids.add(id);
            return { ...current, ids };
        });
    };
    const toggleAll = () => setSelection({
        source: items,
        ids: new Set(allChecked ? [] : items.map((item) => item.id)),
    });
    const remove = (targets: CartItem[]) => {
        if (deleting.current || !targets.length) return;
        onRemovalStart(targets.map((item) => item.id));
        setMessage('');
        if (!isLoggedIn) {
            removeGuestItems(targets.map((item) => item.optionId));
            return;
        }
        deleting.current = true;
        startTransition(async () => {
            const removedIds: string[] = [];
            try {
                for (let offset = 0; offset < targets.length; offset += 50) {
                    const ids = targets.slice(offset, offset + 50).map((item) => item.id);
                    const result = await removeCartItems(ids);
                    removedIds.push(...result.removedIds);
                    if (!result.success) {
                        setMessage(result.message ?? '상품을 삭제하지 못했습니다. 다시 시도해 주세요.');
                        break;
                    }
                }
            } catch {
                setMessage('상품을 삭제하지 못했습니다. 다시 시도해 주세요.');
            } finally {
                onRemovalEnd(removedIds);
                if (removedIds.length) router.refresh();
                deleting.current = false;
            }
        });
    };

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
                                <input ref={selectionControlRef} type="checkbox" checked={allChecked} disabled={pending} onChange={toggleAll} />
                                <span>전체</span>
                            </label>

                            <div className="flex items-center justify-center gap-2 font-medium">
                                <button type="button" disabled={pending || selected.length === 0} onClick={() => remove(selected)}>선택 삭제</button>
                                <RxDividerVertical />
                                <button type="button" disabled={pending || soldOut.length === 0} onClick={() => remove(soldOut)}>품절 삭제</button>
                            </div>
                        </div>

                        {/* 배송 그룹별 상품 목록 */}
                        {message && <p role="alert" className="py-4 text-sm text-red-600">{message}</p>}
                        {pending && <p role="status" className="py-4 text-sm">상품을 삭제하는 중입니다…</p>}
                        {visibleGroups.map((group) => {
                            const payment = summary.groups.find((selectedGroup) => selectedGroup.key === group.key);
                            const productTotal = payment?.productTotal ?? 0;
                            const deliveryFee = payment?.deliveryFee ?? 0;
                            return (
                            <section key={group.key} className="border-b border-black">
                                {/* 배송 타입 + 업체명 */}
                                <h3 className="mt-[30px] text-[14px] font-semibold">
                                    [{group.deliveryType}] {group.brandName}
                                </h3>

                                <ul className="border-secondary flex flex-col gap-[30px] border-b pt-[20px] pb-[30px]">
                                    {group.items.map((item) => (
                                        <CartProductItem
                                            key={item.id}
                                            item={item}
                                            checked={selection.ids.has(item.id)}
                                            pending={pending}
                                            onCheckedChange={() => toggle(item.id)}
                                            onRemove={() => remove([item])}
                                        />
                                    ))}
                                </ul>

                                {/* 그룹 결제 금액 */}
                                <div className="flex items-center justify-center gap-1 py-[30px] text-[16px] font-medium">
                                    <span>{formatPrice(productTotal)}원 + </span>
                                    <span>배송비 {formatPrice(deliveryFee)}원 = </span>
                                    <span>{formatPrice(productTotal + deliveryFee)}원</span>

                                    {/* 배송비 안내 툴팁 */}
                                    <button type="button" className="group relative" aria-label="배송비 안내">
                                        <div className="text-faint">
                                            <AiOutlineExclamationCircle />
                                        </div>

                                        <span className="absolute top-full left-1/2 mt-2 hidden -translate-x-1/2 rounded border border-black bg-white px-[30px] py-[20px] text-[14px] whitespace-nowrap group-hover:block group-focus:block">
                                            {deliveryFee === 0
                                                ? `[${group.deliveryType}] 무료배송`
                                                : `[${group.deliveryType}] ${formatPrice(FREE_DELIVERY_PRICE)}원 미만 결제 시 배송비 ${formatPrice(deliveryFee)}원`}
                                        </span>
                                    </button>
                                </div>
                            </section>
                            );
                        })}

                        {/* 안내문구 */}
                        <p className="text-subtle flex items-center gap-1 pt-[30px] text-[13px]">
                            <IoMdInformationCircleOutline />
                            품절 상품은 결제 금액에서 제외됩니다.
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
