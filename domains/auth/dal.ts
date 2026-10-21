import 'server-only';
import { getSession } from './lib/session';
import { findUserById, type User } from './lib/users';
import { createServerClient } from '@/shared/lib/supabase';

/**
 * 현재 로그인한 사용자 (비로그인이면 null).
 * 서버 컴포넌트/Server Action에서 사용. 쿠키를 읽으므로
 * 서버 컴포넌트에서는 <Suspense> 안에서 호출해야 한다 (cacheComponents).
 */
export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    if (!session) return null;
    return findUserById(session.userId);
}

/**
 * 로그인 여부: 자체 세션(아이디 로그인) 또는 Supabase 로그인 중 하나라도 있으면 true.
 * 쿠키를 읽으므로 서버 컴포넌트에서는 <Suspense> 안에서 호출해야 한다.
 */
export async function isLoggedIn(): Promise<boolean> {
    if (await getSession()) return true;

    // getUser() 는 Supabase 서버에 토큰을 검증받는다 (쿠키만 믿는 getSession() 보다 안전)
    const { data } = await createServerClient().auth.getUser();
    return data.user !== null;
}
