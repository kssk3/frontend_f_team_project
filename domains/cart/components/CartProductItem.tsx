// 장바구니(01 cart)와 주문(02 order) 페이지에서 사용 : 담긴 상품 한 줄

import Link from 'next/link';
import Image from 'next/image';
import { GoX } from 'react-icons/go'; // X 아이콘

import OptionChangeModal from './OptionChangeModal';
import type { CartItem } from '../types/types';
import { formatPrice, unitPrice } from '../utils/cartItem.utils';

// 이미지가 없거나 next.config 에 허용되지 않은 주소일 때 쓰는 기본 이미지
import fallbackImg from '../data/model.jpg';

const ALLOWED_IMAGE_HOST = 'https://images.unsplash.com/';

const STATUS_LABEL: Record<CartItem['status'], string | null> = {
    available: null,
    soldOut: '품절',
    notEnough: '재고 부족',
};

export default function CartProductItem({ item }: { item: CartItem }): React.JSX.Element {
    const imageSrc = item.imageUrl.startsWith(ALLOWED_IMAGE_HOST) ? item.imageUrl : fallbackImg;
    const statusLabel = STATUS_LABEL[item.status];
    const isSoldOut = item.status === 'soldOut';

    return (
        <li className="flex items-start gap-[20px]">
            {/* 1. 상품 선택 */}
            <input type="checkbox" defaultChecked={!isSoldOut} disabled={isSoldOut} aria-label={`${item.productName} 선택`} />

            {/* 2. 상품 대표 이미지 */}
            <Link
                href={`/product/${item.productId}`}
                className="relative aspect-[3/4] w-[140px] overflow-hidden bg-faint"
            >
                <Image
                    src={imageSrc}
                    alt={item.productName}
                    fill
                    sizes="140px"
                    className={isSoldOut ? 'object-cover opacity-40' : 'object-cover'}
                />
            </Link>

            {/* 왼쪽 - 상품정보 */}
            <div className="flex flex-1 flex-col justify-between self-stretch pt-[20px] text-[14px]">
                {/* 위쪽 : 브랜드 + 상품명 */}
                <div>
                    <p className="font-semibold">{item.brandName}</p>
                    <Link href={`/product/${item.productId}`} className="text-muted-foreground font-medium">
                        {item.productName}
                    </Link>
                    {statusLabel && (
                        <p className="mt-[6px] text-[13px] font-semibold text-red-600">
                            {statusLabel}
                            {item.status === 'notEnough' && ` (남은 수량 ${item.stock}개)`}
                        </p>
                    )}
                </div>

                {/* 아래 : 옵션 / 수량 + 옵션 변경 */}
                <div className="flex flex-col items-start gap-[10px]">
                    <p className="text-subtle">
                        {item.size} / {item.quantity}개
                    </p>
                    <OptionChangeModal />
                </div>
            </div>

            {/* 오른쪽 - 삭제 가격 구매 */}
            <div className="flex w-[280px] flex-col items-center justify-between self-stretch">
                {/* 위쪽 : 삭제버튼 X 아이콘 */}
                <button type="button" aria-label="상품 삭제" className="self-end text-[20px]">
                    <GoX />
                </button>

                {/* 가운데 : 가격 (1개 가격 × 수량) */}
                <div className="text-center">
                    {item.basePrice > item.salePrice && (
                        <p className="text-faint text-[13px] line-through">
                            {formatPrice((item.basePrice + item.extraPrice) * item.quantity)}원
                        </p>
                    )}
                    <p className="text-[18px] font-semibold">
                        {formatPrice(unitPrice(item) * item.quantity)}원
                    </p>
                </div>

                {/* 아래 : 바로 구매하기 */}
                <Link
                    href="#"
                    aria-disabled={isSoldOut}
                    className="flex h-[46px] w-full items-center justify-center rounded-[3px] border text-[14px] font-medium aria-disabled:pointer-events-none aria-disabled:opacity-40"
                >
                    바로 구매하기
                </Link>
            </div>
        </li>
    );
}
