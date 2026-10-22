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
