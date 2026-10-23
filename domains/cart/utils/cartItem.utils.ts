// 장바구니 데이터를 화면 모양으로 바꾸고 금액을 계산하는 순수 함수
import type { CartGroup, CartItem, CartOptionRow, CartSummary } from '../types/types';

// 배송비 무료 기준 (그룹 상품 금액이 이 금액 이상이면 배송비 0원)
export const FREE_DELIVERY_PRICE = 100000;

// 화면에 보여 줄 금액 형식 (예: 39,000)
export const formatPrice = (n: number) => n.toLocaleString('ko-KR');

// 1개 가격 = 판매가 + 옵션 추가금
export const unitPrice = (item: CartItem) => item.salePrice + item.extraPrice;

// Header quantity includes all displayed rows, independently of payment selection.
export const countCartQuantity = (items: readonly CartItem[]) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

// 대표 이미지: 썸네일 → 없으면 순서가 가장 앞선 이미지
function pickImage(images: NonNullable<CartOptionRow['products']>['product_images']): string {
    const alive = images.filter((img) => !img.deleted_at);
    const thumbnail = alive.find((img) => img.is_thumbnail);
    if (thumbnail) return thumbnail.image_url;
    const first = [...alive].sort((a, b) => a.sort_order - b.sort_order)[0];
    return first?.image_url ?? '';
}

// DB 옵션 한 개 + 담은 수량 → 화면용 CartItem (상품 정보가 없으면 null)
export function toCartItem(id: string, quantity: number, option: CartOptionRow): CartItem | null {
    const product = option.products;
    if (!product) return null;

    const status: CartItem['status'] =
        option.stock <= 0 ? 'soldOut' : quantity > option.stock ? 'notEnough' : 'available';

    return {
        id,
        optionId: option.id,
        productId: product.id,
        brandName: product.brands?.name ?? '',
        productName: product.name,
        size: option.size,
        imageUrl: pickImage(product.product_images),
        basePrice: product.base_price,
        salePrice: product.sale_price ?? product.base_price,
        extraPrice: option.extra_price ?? 0,
        deliveryType: product.delivery_type,
        deliveryFee: product.delivery_fee ?? 0,
        quantity,
        stock: option.stock,
        status,
    };
}

// 배송 그룹 묶기 + 결제 정보 계산 (품절 상품은 금액에서 뺀다)
export function summarizeCart(items: CartItem[]): CartSummary {
    const groupMap = new Map<string, CartGroup>();

    for (const item of items) {
        const key = `${item.deliveryType}-${item.brandName}`;
        const group = groupMap.get(key) ?? {
            key,
            deliveryType: item.deliveryType,
            brandName: item.brandName,
            items: [],
            productTotal: 0,
            deliveryFee: 0,
        };
        group.items.push(item);
        if (item.status !== 'soldOut') {
            group.productTotal += unitPrice(item) * item.quantity;
            group.deliveryFee = Math.max(group.deliveryFee, item.deliveryFee);
        }
        groupMap.set(key, group);
    }

    const groups = [...groupMap.values()].map((group) => ({
        ...group,
        deliveryFee: group.productTotal >= FREE_DELIVERY_PRICE ? 0 : group.deliveryFee,
    }));

    const buyable = items.filter((item) => item.status !== 'soldOut');
    const totalProduct = groups.reduce((sum, g) => sum + g.productTotal, 0);
    const totalDelivery = groups.reduce((sum, g) => sum + g.deliveryFee, 0);
    const totalDiscount = buyable.reduce(
        (sum, item) => sum + (item.basePrice - item.salePrice) * item.quantity,
        0,
    );
    const totalCount = buyable.reduce((sum, item) => sum + item.quantity, 0);

    return {
        groups,
        totalProduct,
        totalDelivery,
        totalDiscount,
        totalPrice: totalProduct + totalDelivery,
        totalCount,
    };
}
