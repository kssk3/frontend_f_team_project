import { expect, test } from 'vitest';
import { countCartQuantity, summarizeCart } from './cartItem.utils';
import type { CartItem } from '../types/types';

export const cartFixture = (id: string, overrides: Partial<CartItem> = {}): CartItem => ({
    id, optionId: `option-${id}`, productId: `product-${id}`, productName: `상품 ${id}`,
    brandName: '브랜드', size: 'M', imageUrl: '', basePrice: 12000, salePrice: 10000,
    extraPrice: 0, deliveryType: '일반배송', deliveryFee: 3000, quantity: 2,
    stock: 10, status: 'available', ...overrides,
});

test('badge sums every visible quantity including sold-out items', () => {
    expect(countCartQuantity([
        cartFixture('a'), cartFixture('b', { quantity: 3, status: 'soldOut', stock: 0 }),
    ])).toBe(5);
    expect(countCartQuantity([])).toBe(0);
});

test('selected payment totals exclude sold-out quantity without changing visible groups', () => {
    const items = [cartFixture('a'), cartFixture('b', { quantity: 3, status: 'soldOut', stock: 0 })];
    expect(summarizeCart(items)).toMatchObject({ totalCount: 2, totalProduct: 20000, totalDelivery: 3000, totalPrice: 23000 });
    expect(summarizeCart(items).groups[0].items).toHaveLength(2);
    expect(summarizeCart([])).toMatchObject({ totalCount: 0, totalPrice: 0 });
});
