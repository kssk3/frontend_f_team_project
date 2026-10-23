'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import type { CartAddResult } from '../types/types';
import { getCartActor } from '../queries/getCartActor.query';
import { getProductStock } from '../queries/getProductStocks.query';
import { getCartItemByOption } from '../queries/getCartItemByOption.query';
import { validateCartInput } from '../utils/cartValidation';

export async function addToCartItem(_prevState: ActionState, formData: FormData): Promise<CartAddResult> {
    const rawId = formData.get('optionID');
    const rawQuantity = formData.get('quantity');
    const optionId = typeof rawId === 'string' ? rawId : '';
    const quantity = typeof rawQuantity === 'string' && rawQuantity.trim() ? Number(rawQuantity) : NaN;
    const errors = validateCartInput({ optionID: optionId, quantity });
    if (Object.keys(errors).length) return { success: false, errors, message: '상품 옵션과 수량을 확인해 주세요.' };

    const actor = await getCartActor();
    if (actor.kind === 'error') return { success: false, message: '로그인 정보를 확인하지 못했습니다. 다시 시도해 주세요.' };
    try {
        const stock = await getProductStock(optionId);
        if (stock === null) return { success: false, message: '존재하지 않는 상품입니다.' };
        const cartItem = actor.kind === 'member' ? await getCartItemByOption(actor.userId, optionId) : null;
        const totalQuantity = (cartItem?.quantity ?? 0) + quantity;
        if (totalQuantity > stock || totalQuantity > 99) return { success: false, message: '담을 수 있는 재고 수량을 초과했습니다.' };
        if (actor.kind === 'guest') return { success: true, mode: 'guest' };

        const supabase = createServerClient();
        const result = cartItem
            ? await supabase.from('cart_items')
                .update({ quantity: totalQuantity, updated_at: new Date().toISOString() })
                .eq('id', cartItem.id).eq('user_id', actor.userId).is('deleted_at', null).select('id')
            : await supabase.from('cart_items')
                .insert({ user_id: actor.userId, option_id: optionId, quantity, is_checked: true }).select('id');
        if (result.error || !result.data?.length) return { success: false, message: '장바구니 담기에 실패했습니다.' };
        revalidatePath('/cart');
        revalidatePath('/', 'layout');
        return { success: true, mode: 'member', message: '장바구니에 담았습니다.' };
    } catch {
        return { success: false, message: '장바구니 서비스에 연결하지 못했습니다. 다시 시도해 주세요.' };
    }
}
