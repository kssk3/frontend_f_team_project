'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

// react-icons 컴포넌트 활용
import { FiMinus, FiPlus } from 'react-icons/fi';
// 찜 아이콘 = 사각형 두 개. Feather 에 없는 모양이라 Phosphor 세트에서 가져옴 (Light = 빈 상태, Fill = 찜한 상태)
import { PiRowsFill, PiRowsLight } from 'react-icons/pi';

// 추후 교체 BASE_PRICE, SALE_PRICE, MAX_BENEFIT_PRICE, SIZES
const BASE_PRICE = 259000; // 정가
const SALE_PRICE = Math.floor(BASE_PRICE * 0.95); // 판매가 (상품 할인 5%) — 할인 정책 생기면 교체
const MAX_BENEFIT_PRICE = Math.floor(BASE_PRICE * 0.82); // 최대 혜택가 (쿠폰·카드 포함) — 쿠폰 정책 없다면 삭제
// 정가 대비 할인율(%) — 레퍼런스처럼 판매가·최대 혜택가 모두 정가 기준으로 표시한다
const rateOf = (price: number) => Math.round((1 - price / BASE_PRICE) * 100);
const SIZES = [
    { label: 'M', add: 0, soldOut: false },
    { label: 'L', add: 5000, soldOut: false },
    { label: 'XL', add: 10000, soldOut: true },
];

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
export default function DetailPurchasePanel() {
    const [size, setSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);

    const picked = SIZES.find((s) => s.label === size);
    // 옵션별 추가금액 없다면 삭제
    // 실제로 결제하는 1개 가격 = 판매가 + 옵션 추가금 (정가가 아니다)
    const unitPrice = SALE_PRICE + (picked?.add ?? 0);
    const total = unitPrice * quantity;
    const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;
    const LikeIcon = liked ? PiRowsFill : PiRowsLight;

    return (
        <div className="flex flex-col">
            {/* 왼쪽 = 브랜드·상품명·뱃지 묶음, 오른쪽 = 찜 버튼. items-start 로 버튼 윗선을 브랜드명에 맞춘다 */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold tracking-wide text-neutral-900 underline">
                        브랜드명
                    </p>
                    <h1 className="mt-2 text-lg leading-snug font-medium md:text-xl">상품명</h1>
                    <div className="mt-2 flex gap-1">
                        <span className="rounded border border-neutral-900 px-1.5 py-0.5 text-[10px] font-bold">
                            COUPON
                        </span>
                        <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            EXCLUSIVE
                        </span>
                    </div>
                </div>
                {/* 데스크톱 전용. 모바일은 하단 고정 바의 찜 버튼이 대신한다 */}
                <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    aria-pressed={liked}
                    aria-label="찜하기"
                    className="hidden shrink-0 flex-col items-center gap-1 text-neutral-900 md:flex"
                >
                    <LikeIcon size={24} />
                    <span className="text-xs text-neutral-500">996+</span>
                </button>
            </div>

            {/* 가격 — 위: 정가(취소선) / 아래: 할인율(빨강) + 판매가 */}
            <div className="mt-5 flex items-start justify-between">
                <div>
                    <p className="text-sm text-neutral-400 line-through">
                        {BASE_PRICE.toLocaleString('ko-KR')}
                    </p>
                    {/* items-baseline = 할인율과 판매가의 밑선을 맞춘다 */}
                    <p className="mt-1 flex items-baseline gap-2 text-2xl font-bold">
                        <span className="text-red-600">{rateOf(SALE_PRICE)}%</span>
                        <span>{SALE_PRICE.toLocaleString('ko-KR')}</span>
                    </p>
                </div>
                <button
                    type="button"
                    className="rounded border border-neutral-300 px-2 py-1 text-xs">
                    { /*쿠폰 정책 추가되면 추가  onClick={() => setLiked(!liked)} */}
                </button>
            </div>

            {/* 최대 혜택가 — 별도 줄. + 를 누르면 할인 내역이 펼쳐진다 */}
            <details className="group mt-6 border-y border-neutral-200 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="font-bold">최대 혜택가</span>
                    <span className="flex items-center gap-2">
                        <span className="font-bold text-red-600">{rateOf(MAX_BENEFIT_PRICE)}%</span>
                        <span className="font-bold">{won(MAX_BENEFIT_PRICE)}</span>
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
                <BenefitRow label="배송 정보" summary="무료 배송 평일 14시 이전">
                    배송비 정책과 출고기준 시각이 들어갈 자리
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
                <ul className="mt-2 grid grid-cols-4 gap-2">
                    {SIZES.map((s) => (
                        <li key={s.label}>
                            <button
                                type="button"
                                disabled={s.soldOut}
                                onClick={() => setSize(s.label)}
                                className={cn(
                                    'h-10 w-full border text-sm transition',
                                    s.soldOut &&
                                        'cursor-not-allowed border-neutral-100 text-neutral-300 line-through',
                                    !s.soldOut && size === s.label && 'border-neutral-900 font-bold',
                                    !s.soldOut &&
                                        size !== s.label &&
                                        'border-neutral-200 hover:border-neutral-400',
                                )}
                            >
                                {s.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 선택 옵션은 사이즈 선택 후에만 나타남 */}
            {size !== null && (
                <div className="mt-4 bg-neutral-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm">
                            상품명 / <span className="font-medium">{size}</span>
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
                            <button
                                type="button"
                                aria-label="수량 늘리기"
                                onClick={() => setQuantity((q) => q + 1)}
                                className="grid h-8 w-8 place-items-center"
                            >
                                <FiPlus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 총 금액 */}
            <div className="mt-5 flex items-baseline justify-between border-t border-neutral-200 pt-4">
                <span className="text-sm text-neutral-500">총 상품 금액</span>
                <span className="text-xl font-bold">{size === null ? '-' : won(total)}</span>
            </div>

            <div className="mt-4 hidden gap-2 md:flex">
                <button
                    type="button"
                    className="h-12 flex-1 border border-neutral-900 text-sm font-bold"
                >
                    장바구니에 담기
                </button>
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
                <button type="button" className="h-12 flex-1 border border-neutral-900 text-sm font-bold">
                    장바구니에 담기
                </button>
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
