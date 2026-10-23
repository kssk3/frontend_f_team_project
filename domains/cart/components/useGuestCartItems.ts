'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { fetchGuestCartItems } from '../actions/getGuestCartItems.actions';
import type { CartItem, GuestCartItem } from '../types/types';

type Loaded = { source: GuestCartItem[]; items: CartItem[]; failed: boolean; attempt: number };

export function useGuestCartItems(enabled = true) {
    const stored = useCartStore((state) => state.items);
    const hydrated = useCartStore((state) => state._hasHydrated);
    const [loaded, setLoaded] = useState<Loaded | null>(null);
    const attempt = useCartStore((state) => state._metadataVersion);
    const retry = useCartStore((state) => state.retryMetadata);

    useEffect(() => {
        if (!enabled || !hydrated || !stored.length) return;
        let ignore = false;
        fetchGuestCartItems(stored).then(
            (items) => { if (!ignore) setLoaded({ source: stored, items, failed: false, attempt }); },
            () => { if (!ignore) setLoaded({ source: stored, items: [], failed: true, attempt }); },
        );
        return () => { ignore = true; };
    }, [enabled, hydrated, stored, attempt]);

    if (!enabled || !hydrated) return { status: 'loading' as const, items: [], retry };
    if (!stored.length) return { status: 'ready' as const, items: [], retry };
    // A healthy consumer remains mounted during a coordinated background retry.
    // Failed consumers still show loading until their own fresh request succeeds.
    if (loaded?.source === stored && (!loaded.failed || loaded.attempt === attempt)) {
        return { status: loaded.failed ? 'error' as const : 'ready' as const, items: loaded.items, retry };
    }
    // A removal can immediately reuse unchanged product metadata while its fresh request runs.
    if (loaded && !loaded.failed && loaded.attempt === attempt && stored.every((item) =>
        loaded.source.some((previous) => previous.optionId === item.optionId && previous.quantity === item.quantity))) {
        return { status: 'ready' as const, items: loaded.items.filter((item) => stored.some((value) => value.optionId === item.optionId)), retry };
    }
    return { status: 'loading' as const, items: [], retry };
}
