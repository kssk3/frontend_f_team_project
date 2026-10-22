'use server';

import{ ActionState } from '@/shared/types/action.types';
import { validateSignUpInput } from '../utils/authValidation'
import { createServerClient } from '@/shared/lib/supabase';
import { createAdminClient } from '@/shared/lib/supabaseAdmin';
import { revalidatePath} from 'next/cache';

export async function signUpAction(prevState: ActionState, formData: FormData,): Promise <ActionState> {

    const name = (formData.get('name') as string) ?? '';
    const email = (formData.get('email') as string) ?? '';
    const password = (formData.get('password') as string) ?? '';
    const passwordConfirm = (formData.get('passwordConfirm') as string) ?? '';
    const phone = (formData.get('phone') as string) ?? '';

    //필드별 유효성 검사
    const errors = validateSignUpInput({
        name, email, password, passwordConfirm,
    });

    if(Object.keys(errors).length > 0) { // 검증 실패
        return {
            success : false,
            errors,
        };
    }    

    //가입 처리
    const supabase = createServerClient();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
    });

    if (signUpError || !authData.user) {
        const isDuplicate =
        signUpError?.message
            ?.toLowerCase()
            .includes('already registered') ||
            signUpError?.message?.toLowerCase().includes('already exists');

        return {
            success: false,
            message: isDuplicate
                ? '이미 가입된 이메일 주소입니다. 다른 이메일을 사용해 주세요.'
                : `회원가입에 실패했습니다: ${signUpError?.message || '알 수 없는 오류'}`,
        };
    }

    //users 테이블 추가 처리 (id는 Supabase Auth 계정 id와 동일)
    // 가입 직후에는 세션이 없어 anon 권한으로 RLS에 막히므로 관리자 클라이언트로 insert
    const admin = createAdminClient();
    if (!admin) {
        return {
            success: false,
            message: '서버 설정 오류로 회원가입을 완료하지 못했습니다.',
        };
    }

    const userId = authData.user.id;
    const {error: profileError } = await admin.from('users')
        .insert({
            id: userId,
            name: name.trim(),
            phone: phone.trim(),
        });
    if (profileError) {
        // 프로필 없이 Auth 계정만 남지 않도록 롤백
        await admin.auth.admin.deleteUser(userId);
        return {
            success: false,
            message: `회원 프로필 생성에 실패했습니다: ${profileError.message}`,
        };
    }
    revalidatePath('/','layout');

    return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: {}
    }
}