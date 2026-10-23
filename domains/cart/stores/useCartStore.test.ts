import { beforeEach, expect, test } from 'vitest';
import { useCartStore } from './useCartStore';

beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [], _hasHydrated: true });
});

test('bulk removal preserves unselected options and persists the result on rehydration', async () => {
    useCartStore.getState().add('option-a', 2);
    useCartStore.getState().add('option-b', 3);
    useCartStore.getState().add('option-c', 1);
    useCartStore.getState().removeMany(['option-a', 'option-c']);
    expect(useCartStore.getState().items).toEqual([{ optionId: 'option-b', quantity: 3 }]);
    const saved = localStorage.getItem('guest-cart-storage');
    useCartStore.setState({ items: [], _hasHydrated: false });
    localStorage.setItem('guest-cart-storage', saved!);
    await useCartStore.persist.rehydrate();
    expect(useCartStore.getState().items).toEqual([{ optionId: 'option-b', quantity: 3 }]);
    expect(useCartStore.getState()._hasHydrated).toBe(true);
});

test('single removal of the last option persists an empty cart', async () => {
    useCartStore.getState().add('option-a', 2);
    useCartStore.getState().remove('option-a');
    await useCartStore.persist.rehydrate();
    expect(useCartStore.getState().items).toEqual([]);
});
