'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { clearLoginCookies } from '../utils/clearLoginCookies';
import { validateSignInInput } from '../utils/authValidation';

export async function signInAction(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const rawEmail = formData.get('email');
    const rawPassword = formData.get('password');
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const password = typeof rawPassword === 'string' ? rawPassword : '';
    const errors = validateSignInInput({ email, password });
    if (Object.keys(errors).length > 0) return { success: false, errors };

    let supabase: ReturnType<typeof createServerClient>;
    try {
        supabase = createServerClient();
    } catch {
        return {
            success: false,
            message:
                '로그인 서비스 설정을 확인할 수 없습니다. 관리자에게 문의해 주세요.',
        };
    }

    let signedIn = false;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !data.user) {
            if (error?.code === 'email_not_confirmed') {
                return {
                    success: false,
                    message: '이메일 인증을 완료한 뒤 다시 로그인해 주세요.',
                };
            }
            if (error && error.code !== 'invalid_credentials') {
                return {
                    success: false,
                    message:
                        '인증 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
                };
            }
            return {
                success: false,
                message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            };
        }
        signedIn = true;
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, deleted_at')
            .eq('id', data.user.id)
            .maybeSingle();
        if (
            profileError ||
            !profile ||
            profile.id !== data.user.id ||
            profile.deleted_at
        ) {
            try {
                await supabase.auth.signOut({ scope: 'local' });
            } finally {
                await clearLoginCookies();
            }
            signedIn = false;
            return {
                success: false,
                message:
                    profileError || (profile && profile.id !== data.user.id)
                        ? '회원 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.'
                        : profile?.deleted_at
                          ? '탈퇴한 회원입니다. 고객센터에 문의해 주세요.'
                          : '프로필이 존재하지 않습니다. 고객센터에 회원 정보 복구를 문의해 주세요.',
            };
        }
    } catch {
        if (signedIn) {
            try {
                await supabase.auth.signOut({ scope: 'local' });
            } catch {
                /* Still clear the browser session below. */
            }
            await clearLoginCookies();
        }
        return {
            success: false,
            message:
                '인증 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        };
    }

    revalidatePath('/', 'layout');
    return { success: true, message: '로그인 되었습니다.' };
}
