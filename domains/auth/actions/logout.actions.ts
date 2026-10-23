'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { clearLoginCookies } from '../utils/clearLoginCookies';

export async function logoutAction(): Promise<ActionState> {
    try {
        await createServerClient().auth.signOut({ scope: 'local' });
    } catch {
        // Local logout must still complete during a service/configuration failure.
    } finally {
        await clearLoginCookies();
    }
    revalidatePath('/', 'layout');
    return { success: true };
}
