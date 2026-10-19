// 장바구니(01 cart)와 주문(02 order) 페이지에서 사용예정


import { GoX } from "react-icons/go"; // X 아이콘

import Link from "next/link";
import Image from "next/image";

// 연습용 이미지
import productImg from "../data/model.jpg";

export default function CartProductItem(): React.JSX.Element {
    return (
        // 상품 리스트
        <li className="flex items-start gap-[20px]">
            {/* 1. 상품 선택 */}
            <input type="checkbox" />

            {/* 2. 상품 대표 이미지 */}
            <div className="relative aspect-[3/4] w-[140px] overflow-hidden bg-faint">
                <Image 
                    src={productImg}
                    alt='상품이미지'
                    fill
                    sizes="140px"
                    className="object-cover"
                    />
            </div>
            
            {/* 왼쪽 - 상품정보 */}
            <div className="flex flex-1 flex-col justify-between self-stretch text-[14px] pt-[20px]">

                {/* 위쪽 : 상품명 */}
                <p className="text-muted-foreground font-medium">
                    {'상품명'}
                </p>

                {/* 아래 : 묶음 - 옵션 / 상품개수 + 옵션 변경 */}
                <div className="flex flex-col items-start gap-[10px]">
                    <p className="text-subtle">
                        {'상품 옵션'} / {'상품 갯수'}개
                    </p>
                    <button type="button" className="underline">
                        옵션 변경
                    </button>
                </div>

            </div>

            {/* 오른쪽 - 삭제 가격 구매 */}
            <div className="flex w-[280px] flex-col items-center justify-between self-stretch">

                {/* 위쪽 : 삭제버튼 X 아이콘 */}
                <button type="button" aria-label="상품 삭제" className="self-end text-[20px]">
                    <GoX />
                </button>

                {/* 가운데 : 가격 */}
                <p className="text-[18px] font-semibold">{'상품 가격'}</p>

                {/* 아래 : 바로 구매하기 */}
                <Link
                    href='#'
                    className="flex h-[46px] w-full items-center justify-center rounded-[3px] border text-[14px] font-medium">
                        바로 구매하기
                </Link>
            </div>


            </li>
    )
} ;