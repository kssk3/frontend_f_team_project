'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { deleteSession } from '../lib/session';

export async function logoutAction(): Promise<ActionState> {
    const supabase = createServerClient();

    // 1. Supabase 로그아웃 (서버의 refresh token 폐기 + sb-* 쿠키 삭제)
    const { error } = await supabase.auth.signOut();

    // 2. 확실하게: signOut 이 실패해도 브라우저에 남은 로그인 쿠키는 모두 지운다
    //    - sb-*  : Supabase 로그인 쿠키
    //    - session : /login 페이지(아이디 로그인)가 쓰는 자체 세션 쿠키
    const cookieStore = await cookies();
    cookieStore
        .getAll()
        .filter(({ name }) => name.startsWith('sb-'))
        .forEach(({ name }) => cookieStore.delete(name));
    await deleteSession();

    // 이미 로그아웃된 상태(세션 없음)는 실패로 보지 않는다
    if (error && error.name !== 'AuthSessionMissingError') {
        return {
            success: false,
            message: `로그아웃 처리중 오류가 발생했습니다: ${error.message}`,
        };
    }

    revalidatePath('/', 'layout');

    return {
        success: true,
    };
}
