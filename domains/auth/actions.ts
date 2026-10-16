'use server';

import { redirect } from 'next/navigation';
import { findUserByCredentials } from './lib/users';
import { verifyRecaptcha } from './lib/recaptcha';
import { createSession, deleteSession } from './lib/session';

export type LoginState = { message: string } | undefined;

export async function login(
    _prev: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const loginId = String(formData.get('loginId') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const token = String(formData.get('recaptchaToken') ?? '');

    if (!loginId || !password) {
        return { message: '아이디와 비밀번호를 입력해 주세요.' };
    }

    if (!(await verifyRecaptcha(token))) {
        return { message: '자동 입력 방지 확인에 실패했습니다. 다시 시도해 주세요.' };
    }

    const user = await findUserByCredentials(loginId, password);
    if (!user) {
        // 아이디/비밀번호 중 무엇이 틀렸는지는 알려주지 않는다
        return { message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }

    await createSession(user.id);
    redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
