'use server';

import { headers } from 'next/headers';
import { ActionState } from '@/shared/types/action.types';
import { createServerClient } from '@/shared/lib/supabase';
import { createAdminClient } from '@/shared/lib/supabaseAdmin';

export interface FoundAccount {
    maskedEmail: string;
    joinedAt: string;
}

const NO_ADMIN_KEY: ActionState<never> = {
    success: false,
    message: '서버 설정(SUPABASE_SERVICE_ROLE_KEY)이 필요합니다.',
};

// abcdef@gmail.com → ab****@gmail.com
function maskEmail(email: string) {
    const [local, domain] = email.split('@');
    return `${local.slice(0, 2)}****@${domain}`;
}

/** 아이디 찾기: 본인인증한 이름 + 휴대폰으로 가입된 이메일(가림 처리) 조회 */
export async function findIdAction(
    name: string,
    phone: string,
): Promise<ActionState<FoundAccount[]>> {
    const admin = createAdminClient();
    if (!admin) return NO_ADMIN_KEY;

    const { data: rows, error } = await admin
        .from('users')
        .select('id, created_at')
        .eq('name', name.trim())
        .eq('phone', phone.trim())
        .is('deleted_at', null);

    if (error) {
        return {
            success: false,
            message: `조회에 실패했습니다: ${error.message}`,
        };
    }

    // 이메일은 users 테이블이 아니라 Supabase Auth 계정에 있다
    const accounts: FoundAccount[] = [];
    for (const row of rows ?? []) {
        const { data } = await admin.auth.admin.getUserById(row.id);
        if (data.user?.email) {
            accounts.push({
                maskedEmail: maskEmail(data.user.email),
                joinedAt: row.created_at,
            });
        }
    }

    if (accounts.length === 0) {
        return {
            success: false,
            message: '입력하신 정보로 가입된 회원이 없습니다.',
        };
    }
    return { success: true, data: accounts };
}

/** 비밀번호 찾기: 회원 정보가 일치하면 비밀번호 재설정 메일 발송 */
export async function requestPasswordResetAction(
    email: string,
    name: string,
    phone: string,
): Promise<ActionState> {
    const admin = createAdminClient();
    if (!admin) return NO_ADMIN_KEY;

    const { data: rows, error } = await admin
        .from('users')
        .select('id')
        .eq('name', name.trim())
        .eq('phone', phone.trim())
        .is('deleted_at', null);

    if (error) {
        return {
            success: false,
            message: `조회에 실패했습니다: ${error.message}`,
        };
    }

    // 이름+휴대폰이 같은 회원 중 이메일까지 일치하는 계정이 있는지 확인
    let matched = false;
    for (const row of rows ?? []) {
        const { data } = await admin.auth.admin.getUserById(row.id);
        if (data.user?.email?.toLowerCase() === email.trim().toLowerCase()) {
            matched = true;
            break;
        }
    }
    if (!matched) {
        return {
            success: false,
            message: '입력하신 정보와 일치하는 회원이 없습니다.',
        };
    }

    // 재설정 메일은 일반 클라이언트로 보낸다 (PKCE 코드 검증용 쿠키가 브라우저에 저장됨)
    // 메일 링크를 누르면 돌아올 주소 (Supabase 대시보드 Redirect URLs에 등록 필요)
    const supabase = createServerClient();
    const origin = (await headers()).get('origin') ?? '';
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${origin}/member/reset-password` },
    );

    if (resetError) {
        return {
            success: false,
            message: `메일 발송에 실패했습니다: ${resetError.message}`,
        };
    }
    return {
        success: true,
        message: `${email.trim()} 으로 비밀번호 재설정 메일을 보냈습니다.`,
    };
}
