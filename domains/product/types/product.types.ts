// 상세 페이지가 쓰는 상품 모양.
// Supabase 연결 후 products 테이블에서 채워짐
// DB 컬럼(snake_case) -> utils/product.utils.ts -> 타입으로 변환(toProduct 한 곳에서만 진행)

export type DeliveryType = '일반배송' | '판매자배송';
// 배송 타입은 products.delivery_type CHECK와 같은 두 값

export type ProductImage = {
    url: string; 
    alt: string;
};

export type ProductOption = {
    id: string;
    size: string;
    extraPrice: number;
    stock: number;
};

export type Product = {
    id: string;
    brand: string;
    name: string; // ← DiscoverItem.title
    category: string; // ← 분류 (Style #트렌치 등)
    basePrice: number; // 정가
    salePrice: number; // 판매가
    discountPrice: number; // 할인가(DB에서 계산)
    deliveryType: DeliveryType;
    deliveryFee: number;
    images: ProductImage[];
    options: ProductOption[];
};

// DB가 돌려주는 모양(page.tsx의 select 문자열과 1:1 맞춤)
export type ProductRow = {
    id: string;
    name: string;
    category: string;
    base_price: number;
    sale_price: number;
    discount_price: number;
    delivery_type: DeliveryType;
    delivery_fee: number;
    brands: { name: string } | null;
    product_images: { image_url: string; alt: string | null }[];
    product_options: {
        id: string;
        size: string;
        extra_price: number;
        stock: number;
    }[];
};
