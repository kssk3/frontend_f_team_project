'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase';
import { getCartActor } from '../queries/getCartActor.query';
import type { CartRemoveResult } from '../types/types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function removeCartItems(input: unknown): Promise<CartRemoveResult> {
    if (!Array.isArray(input) || input.length === 0 || input.length > 50 ||
        input.some((id) => typeof id !== 'string' || !UUID.test(id))) {
        return { success: false, removedIds: [], message: '삭제할 상품을 확인해 주세요.' };
    }
    const ids = [...new Set<string>(input.map((id: string) => id.toLowerCase()))];
    const actor = await getCartActor();
    if (actor.kind !== 'member') {
        return { success: false, removedIds: [], message: '로그인 정보를 확인한 후 다시 시도해 주세요.' };
    }
    try {
        const { data, error } = await createServerClient()
            .from('cart_items')
            .delete()
            .eq('user_id', actor.userId)
            .in('id', ids)
            .is('deleted_at', null)
            .select('id');
        if (error || !data?.length) {
            return { success: false, removedIds: [], message: '상품을 삭제하지 못했습니다. 목록을 확인하고 다시 시도해 주세요.' };
        }
        const removedIds = data.map((row: { id: string }) => row.id).filter((id: string) => ids.includes(id));
        revalidatePath('/cart');
        revalidatePath('/', 'layout');
        const complete = new Set(removedIds).size === ids.length;
        return {
            success: complete,
            removedIds,
            message: complete ? undefined : '일부 상품만 삭제되었습니다. 최신 목록을 확인해 주세요.',
        };
    } catch {
        return { success: false, removedIds: [], message: '장바구니 서비스에 연결하지 못했습니다. 다시 시도해 주세요.' };
    }
}
