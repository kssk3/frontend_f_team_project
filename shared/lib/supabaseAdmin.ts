import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// RLS를 무시하는 관리자 클라이언트. 서버(Server Action 등)에서만 사용할 것.
// SUPABASE_SERVICE_ROLE_KEY 에는 절대 NEXT_PUBLIC_ 을 붙이지 않는다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/** 키가 설정되지 않았으면 null */
export function createAdminClient(): SupabaseClient | null {
    if (!supabaseUrl || !serviceRoleKey) return null;
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
