// 화면에 보여줄 장바구니 상품 (여러 테이블을 합친 모양)
export interface CartItem {
    id: string;              // cart_items.id (삭제·수정할 때 사용)
    optionId: string;        // product_options.id
    productId: string;       // products.id (상품 페이지 링크용)
    brandName: string;       // brands.name
    productName: string;     // products.name
    size: string;            // product_options.size
    imageUrl: string;        // product_images 중 대표 이미지
    basePrice: number;       // 정가
    salePrice: number;       // 판매가
    extraPrice: number;      // 옵션 추가금
    deliveryType: '일반배송' | '판매자배송';
    deliveryFee: number;
    quantity: number;        // 담은 수량
    stock: number;           // 남은 재고
    status: 'available' | 'soldOut' | 'notEnough';  // 계산값: 구매가능/품절/재고부족
}

// 담기·수량 변경 때 받는 값
export interface CartInput {
    optionID: string;
    quantity: number;
}


// 비회원 장바구니에 기억할 상품 한 개 (zustand)
export interface GuestCartItem {
    optionId: string;
    quantity: number;
}

// 비회원 장바구니 store의 모양
export interface CartStore {
    items: GuestCartItem[];
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    add: (optionId: string, quantity: number) => void;
    remove: (optionId: string) => void;
    changeQuantity: (optionId: string, quantity: number) => void;
    clear: () => void;
}

// DB가 돌려주는 옵션 한 개의 모양 (queries/getCartItems.query.ts 의 select 문자열과 1:1)
export interface CartOptionRow {
    id: string;
    size: string;
    extra_price: number | null;
    stock: number;
    products: {
        id: string;
        name: string;
        base_price: number;
        sale_price: number | null;
        delivery_type: '일반배송' | '판매자배송';
        delivery_fee: number | null;
        brands: { name: string } | null;
        product_images: {
            image_url: string;
            sort_order: number;
            is_thumbnail: boolean;
            deleted_at: string | null;
        }[];
    } | null;
}

// 배송 그룹 하나 (같은 배송 타입 + 같은 브랜드끼리 묶음)
export interface CartGroup {
    key: string;
    deliveryType: CartItem['deliveryType'];
    brandName: string;
    items: CartItem[];
    productTotal: number;    // 그룹 상품 금액
    deliveryFee: number;     // 그룹 배송비
}

// 오른쪽 결제 정보
export interface CartSummary {
    groups: CartGroup[];
    totalProduct: number;    // 총 상품 금액
    totalDelivery: number;   // 총 배송비
    totalDiscount: number;   // 총 할인 금액
    totalPrice: number;      // 총 결제 금액
    totalCount: number;      // 총 개수
}
