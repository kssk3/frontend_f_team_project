import 'server-only';
import { createServerClient } from '@/shared/lib/supabase';

export interface CurrentUser {
    id: string;
    name: string;
    email: string | undefined;
}

/** Request-time identity; call from Server Components behind Suspense. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        const supabase = createServerClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) return null;
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, name, deleted_at')
            .eq('id', data.user.id)
            .maybeSingle();
        if (
            profileError ||
            !profile ||
            profile.id !== data.user.id ||
            profile.deleted_at
        )
            return null;
        return { id: data.user.id, name: profile.name, email: data.user.email };
    } catch {
        // Public pages remain usable when configuration or the auth service is unavailable.
        return null;
    }
}

export async function isLoggedIn(): Promise<boolean> {
    return (await getCurrentUser()) !== null;
}
