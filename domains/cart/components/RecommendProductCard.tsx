import Image from "next/image";

import productImg from "../data/model2.jpg";

export default function RecommendProductCard(): React.JSX.Element {
    return (
        // 카드 하나
        <li>
            {/* 사진 상자 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                    src={productImg}
                    alt="추천 상품 이미지"
                    fill
                    sizes="270px"
                    className="object-cover"
                />

                {/* 오른쪽 위 : 장바구니 담기 버튼 */}
                <button
                    type="button"
                    aria-label="장바구니 담기"
                    className="absolute top-[15px] right-[15px]"
                >
                </button>
            </div>

            {/* 상품 정보 */}
            <div className="mt-[20px] flex flex-col gap-[5px]">
                <p className="text-[15px] font-medium">{'브랜드'}</p>
                <p className="text-[15px] text-muted-foreground">{'상품명'}</p>
                <p className="mt-[5px] text-[18px] font-semibold">{'상품 가격'}</p>
            </div>
        </li>
    );
}
