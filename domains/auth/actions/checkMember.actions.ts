'use server';

import { ActionState } from '@/shared/types/action.types';
import { createAdminClient } from '@/shared/lib/supabaseAdmin';

/** 회원가입 본인인증 직후: 같은 휴대폰 번호로 가입된 회원이 있는지 확인 */
export async function checkDuplicateMemberAction(
    phone: string,
): Promise<ActionState<{ exists: boolean }>> {
    // users 테이블은 RLS 가 걸려 있어 가입 전(비로그인) 상태에서는 관리자 클라이언트로 조회
    const admin = createAdminClient();
    if (!admin) {
        return {
            success: false,
            message: '서버 설정(SUPABASE_SERVICE_ROLE_KEY)이 필요합니다.',
        };
    }

    const { count, error } = await admin
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('phone', phone.trim())
        .is('deleted_at', null);

    if (error) {
        return {
            success: false,
            message: `회원 조회에 실패했습니다: ${error.message}`,
        };
    }

    return { success: true, data: { exists: (count ?? 0) > 0 } };
}
