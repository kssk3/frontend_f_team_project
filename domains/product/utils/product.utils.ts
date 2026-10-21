// 상품 데이터를 화면 모양으로 바꾸는 순수 함수
import type { Product, ProductRow } from '../types/product.types';

// 사이즈 표시 순서
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE'];
const sizeRank = (size: string) => {
    const i = SIZE_ORDER.indexOf(size);
    return i === -1 ? SIZE_ORDER.length : i;
};

// DB > 화면용 전환. 이름 규칙 변환(snake > camel)
export const toProduct = (row: ProductRow): Product => ({
    id: row.id,
    brand: row.brands?.name ?? '', 
    name: row.name,
    category: row.category,
    basePrice: row.base_price,
    salePrice: row.sale_price,
    discountPrice: row.discount_price,
    deliveryType: row.delivery_type,
    deliveryFee: row.delivery_fee,
    images: row.product_images.map((img) => ({
        url: img.image_url,
        alt: img.alt ?? row.name,
    })),
    options: row.product_options
        .map((o) => ({
            id: o.id,
            size: o.size,
            extraPrice: o.extra_price,
            stock: o.stock,
        }))
        .sort((a, b) => sizeRank(a.size) - sizeRank(b.size)),
});