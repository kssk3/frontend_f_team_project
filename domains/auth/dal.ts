import 'server-only';
import { getSession } from './lib/session';
import { findUserById, type User } from './lib/users';

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
