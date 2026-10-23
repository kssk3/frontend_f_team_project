'use client';

// 261023 팀 장바구니 컴포넌트 추가. 회원은 DB(cart_items)에 장바구니 정보 저장, 비회원은 브라우저(zustand)에 담고 /cart 로 보냄
// 담기 버튼 2개(PC · 모바일)를 팀 <AddToCartForm/>(PR #53) 으로 교체 
//        → 이 파일은 "무엇을 담을지"(optionId · quantity)만 넘기고, 담는 방법은 cart 도메인이 맡는다

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import AddToCartForm from '@/domains/cart/components/AddToCartForm';
import type { Product } from '@/domains/product/types/product.types';


// react-icons 컴포넌트 활용
import { FiMinus, FiPlus } from 'react-icons/fi';
// 찜 아이콘 = 사각형 두 개. Feather 에 없는 모양이라 Phosphor 세트에서 가져옴 (Light = 빈 상태, Fill = 찜한 상태)
import { PiRowsFill, PiRowsLight } from 'react-icons/pi';

// 접힘 = +, 펼침 = −. 부모 details 의 open 상태를 group-open 으로 읽어 아이콘 바꿈
function ToggleIcon() {
    return (
        <>
            <FiPlus className="shrink-0 text-neutral-900 group-open:hidden" />
            <FiMinus className="hidden shrink-0 text-neutral-900 group-open:block" />
        </>
    );
}

// 혜택 블록(열) 컴포넌트 구성
function BenefitRow({
    label,
    summary,
    children,
}: {
    label: string;
    summary: string;
    children: React.ReactNode;
}) {
    return (
        <details className="group border-b border-neutral-100 py-3">
            {/* group = 자식이 부모상태 확인하고 스타일 바꿀 수 있게 하는 표시 */}
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm">
                <span className="flex items-baseline gap-2">
                    <span className="w-20 shrink-0 text-neutral-500">{label}</span>
                    <span className="font-medium">{summary}</span>
                </span>
                <ToggleIcon />
            </summary>
            <div className="pt-2 pl-20 text-xs leading-relaxed text-neutral-500">
                {children}
            </div>
        </details>
    );
}

// 구매 패널 컴포넌트 구성(사이즈, 수량, 찜하기)
export default function DetailPurchasePanel({product}: {product: Product}) {
   const [optionId, setOptionId] = useState<string | null>(null); // 사이즈 선택 상태
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);


    // picked = 고른 옵션 하나 (안 골랐으면 undefined)
    const picked = product.options.find((o) => o.id === optionId);
    // 정가 대비 할인율(%). 정가 0원이면 0
    const rateOf = (price: number) =>
        product.basePrice > 0 ? Math.round((1 - price / product.basePrice) * 100) : 0;
    // 최대 혜택가 — 임시값(정가 × 0.82, DB 에 없는 계산값). 쿠폰 정책이 생기면 product 기준으로 교체
    const maxBenefitPrice = Math.floor(product.basePrice * 0.82);
    // 실제로 결제하는 1개 가격 = 판매가 + 옵션 추가금 (정가가 아님)
    const unitPrice = product.salePrice + (picked?.extraPrice ?? 0);
    const total = unitPrice * quantity;
    const hasDiscount = product.discountPrice > 0;
    const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
    const deliverySummary = `${product.deliveryType} · ${
        product.deliveryFee === 0 ? '무료배송' : `배송비 ${won(product.deliveryFee)}`
    }`;
    const selectOption = (id: string) => {
        setOptionId(id);
        setQuantity(1);
    };
    const LikeIcon = liked ? PiRowsFill : PiRowsLight;

    return (
        <div className="flex flex-col">
            {/* 왼쪽 = 브랜드·상품명 묶음, 오른쪽 = 찜 버튼. items-start 로 버튼 윗선을 브랜드명에 맞춘다 */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    {/* "브랜드명" 글자 → product.brand */}
                    <p className="text-xs font-bold tracking-wide text-neutral-900 underline">
                        {product.brand}
                    </p>
                    {/* "상품명" 글자 → product.name */}
                    <h1 className="mt-2 text-lg leading-snug font-medium md:text-xl">{product.name}</h1>

                </div>
                {/* 데스크톱 전용. 모바일은 하단 고정 바의 찜 버튼이 대신함 */}
                <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    aria-pressed={liked}
                    aria-label="찜하기"
                    className="hidden shrink-0 flex-col items-center gap-1 text-neutral-900 md:flex"
                >
                    <LikeIcon size={24} />
                </button>
            </div>

            {/* 가격 — 위: 정가(취소선) / 아래: 할인율(빨강) + 판매가 */}
            {/* 가격 블록을 DB 값으로
                  - 정가 줄과 할인율은 할인이 있을 때(hasDiscount)만 보임
                  → 할인 없는 상품(노트 시드의 머플러)은 판매가만 보임 */}
            <div className="mt-5">
                {hasDiscount && (
                    <p className="text-sm text-neutral-400 line-through">
                        {product.basePrice.toLocaleString('ko-KR')}
                    </p>
                )}
                {/* items-baseline = 할인율과 판매가의 밑선을 맞춤 */}
                <p className="mt-1 flex items-baseline gap-2 text-2xl font-bold">
                    {hasDiscount && <span className="text-red-600">{rateOf(product.salePrice)}%</span>}
                    <span>{product.salePrice.toLocaleString('ko-KR')}</span>
                </p>
            </div>

            {/* 261021_ 최대 혜택가(임시 유지) 
                  - 쿠폰 테이블이 DB 가 아니라 화면 계산(정가 × 0.82) → 모든 상품에 18% 로 보임
                  - 쿠폰 데이터가 생기면 maxBenefitPrice 을 그 값으로 바꿈
                  - 삭제하기로 하면 maxBenefitPrice 줄 · 이 블록을 지움  */}
        
            <details className="group mt-6 border-y border-neutral-200 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="font-bold">최대 혜택가</span>
                    <span className="flex items-center gap-2">
                        <span className="font-bold text-red-600">{rateOf(maxBenefitPrice)}%</span>
                        <span className="font-bold">{won(maxBenefitPrice)}</span>
                        <ToggleIcon />
                    </span>
                </summary>
                <div className="pt-3 text-xs leading-relaxed text-neutral-500">
                    상품 할인 · 쿠폰 할인 · 카드 할인 내역이 들어갈 자리
                </div>
            </details>

            {/* 혜택 3줄 구조 */}
            <div>
                <BenefitRow label="추가 혜택" summary="포인트 적립 안내">
                    구매 확정 시 적립되는 포인트, 마일리지 정책이 들어가는 자리
                </BenefitRow>
                <BenefitRow label="결제수단 할인" summary="결제수단별 즉시할인">
                    카드사별 무이자 개월 수와 금액이 들어갈 자리
                </BenefitRow>
                <BenefitRow label="배송 정보" summary={deliverySummary}>
                    {product.deliveryType === '판매자배송'
                        ? '판매자가 직접 발송합니다. 출고 일정은 판매자마다 다릅니다.'
                        : '평일 14시 이전 주문은 당일 출고됩니다.'}
                </BenefitRow>
            </div>

            {/* 사이즈 선택 */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">사이즈</p>
                    <button type="button" className="text-xs text-neutral-500 underline">
                        SIZE GUIDE
                    </button>
                </div>
                {/* 사이즈 버튼 목록 = product.options
                      - 재고 0 = 품절 (버튼 비활성 · 취소선)
                      - key 와 선택 기준은 옵션 id (사이즈 글자 X)
                      - 추가금이 있는 사이즈만 버튼 아래에 작게 표시 → 버튼 높이를 h-10 에서 h-12 로, 세로 배치로 바꿈
                      - 순서(M → L → XL)는 이미 toProduct 의 sizeRank 정렬이 맞춰 옴 */}
                <ul className="mt-2 grid grid-cols-4 gap-2">
                    {product.options.map((o) => {
                        const soldOut = o.stock === 0;
                        const active = o.id === optionId;
                        return (
                            <li key={o.id}>
                                <button
                                    type="button"
                                    disabled={soldOut}
                                    onClick={() => selectOption(o.id)}
                                    aria-pressed={active}
                                    className={cn(
                                        'flex h-12 w-full flex-col items-center justify-center border text-sm transition',
                                        soldOut &&
                                            'cursor-not-allowed border-neutral-100 text-neutral-300 line-through',
                                        !soldOut && active && 'border-neutral-900 font-bold',
                                        !soldOut &&
                                            !active &&
                                            'border-neutral-200 hover:border-neutral-400',
                                    )}
                                >
                                    {o.size}
                                    {o.extraPrice > 0 && (
                                        <span className="text-[10px] font-normal text-neutral-500">
                                            +{o.extraPrice.toLocaleString('ko-KR')}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* 선택 옵션은 사이즈 선택 후에만 표시 */}
            {/* 선택 줄 — 고른 옵션(picked)이 있을 때만, "상품명 / 사이즈" 를 DB 값으로 */}
            {picked && (
                <div className="mt-4 bg-neutral-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm">
                            {product.name} / <span className="font-medium">{picked.size}</span>
                        </p>
                        <div className="flex shrink-0 items-center border border-neutral-300 bg-white">
                            <button
                                type="button"
                                aria-label="수량 줄이기"
                                disabled={quantity === 1}
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="grid h-8 w-8 place-items-center disabled:text-neutral-300"
                            >
                                <FiMinus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm">{quantity}</span>
                            {/* 수량 늘리기 버튼 — 재고보다 많이 못 담게 (재고에 닿으면 비활성, 줄이기 버튼과 같은 회색) */}
                            <button
                                type="button"
                                aria-label="수량 늘리기"
                                disabled={quantity >= picked.stock}
                                onClick={() => setQuantity((q) => Math.min(picked.stock, q + 1))}
                                className="grid h-8 w-8 place-items-center disabled:text-neutral-300"
                            >
                                <FiPlus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 총 금액 */}
            {/* 고른 옵션이 있을 때만 금액, 없으면 '-' 표시 */}
            <div className="mt-5 flex items-baseline justify-between border-t border-neutral-200 pt-4">
                <span className="text-sm text-neutral-500">총 상품 금액</span>
                <span className="text-xl font-bold">{picked ? won(total) : '-'}</span>
            </div>

            {/* "장바구니에 담기" 버튼 2개(데스크톱 · 모바일)는 사이즈를 고르기 전에는 눌리지 않게함 */}
            <div className="mt-4 hidden gap-2 md:flex">
                <AddToCartForm 
                    optionId={picked?.id}
                    quantity={quantity}
                    className="h-12 flex-1 border border-neutral-900 text-sm font-bold disabled:border-neutral-200 disabled:text-neutral-300"
                />

                <button
                    type="button"
                    className="h-12 flex-1 bg-neutral-900 text-sm font-bold text-white"
                >
                    바로 구매하기
                </button>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-neutral-200 bg-white p-3 md:hidden">
                <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    aria-pressed={liked}
                    aria-label="찜하기"
                    className="grid h-12 w-12 shrink-0 place-items-center border border-neutral-300"
                >
                    <LikeIcon size={20} />
                </button>
                <AddToCartForm
                optionId={picked?.id}
                quantity={quantity}
                className="h-12 flex-1 border border-neutral-900 text-sm font-bold disabled:border-neutral-200 disabled:text-neutral-300"
                />

                <button
                    type="button"
                    className="h-12 flex-1 bg-neutral-900 text-sm font-bold text-white"
                >
                    바로 구매하기
                </button>
            </div>
        </div>
    );
}
