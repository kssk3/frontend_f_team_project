import 'server-only';
import { createServerClient } from '@/shared/lib/supabase';
import type { CartActor } from '../types/types';

// A service outage must never silently turn a member mutation into guest storage.
export async function getCartActor(): Promise<CartActor> {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            return error.name === 'AuthSessionMissingError' && !data.user
                ? { kind: 'guest' }
                : { kind: 'error' };
        }
        if (!data.user) return { kind: 'guest' };
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, deleted_at')
            .eq('id', data.user.id)
            .maybeSingle();
        if (profileError || !profile || profile.id !== data.user.id || profile.deleted_at) {
            return { kind: 'error' };
        }
        return { kind: 'member', userId: data.user.id };
    } catch {
        return { kind: 'error' };
    }
}
