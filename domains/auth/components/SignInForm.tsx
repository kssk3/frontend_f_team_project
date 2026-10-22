'use client';

import {
    useActionState,
    useEffect,
    useState,
    useSyncExternalStore,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { signInAction } from '../actions/login.actions';
import { safeRedirect } from '../utils/safeRedirect';
import styles from '@/app/(shop)/login/login.module.css';

const SAVED_EMAIL_KEY = 'savedLoginEmail';
const subscribeNoop = () => () => {};
function readSavedEmail() {
    try {
        return localStorage.getItem(SAVED_EMAIL_KEY) ?? '';
    } catch {
        return '';
    }
}

export default function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = safeRedirect(searchParams.get('redirectUrl'));
    const [state, formAction, pending] = useActionState(
        signInAction,
        INITIAL_ACTION_STATE,
    );
    const savedEmail = useSyncExternalStore(
        subscribeNoop,
        readSavedEmail,
        () => '',
    );
    const [typedEmail, setTypedEmail] = useState<string | null>(null);
    const email = typedEmail ?? savedEmail;
    const [password, setPassword] = useState('');
    const [saveEmail, setSaveEmail] = useState(true);

    useEffect(() => {
        if (state.success) {
            router.replace(redirectUrl);
            router.refresh();
        }
    }, [state.success, router, redirectUrl]);

    function rememberEmail() {
        try {
            if (saveEmail) localStorage.setItem(SAVED_EMAIL_KEY, email.trim());
            else localStorage.removeItem(SAVED_EMAIL_KEY);
        } catch {
            /* Storage may be disabled; authentication still works. */
        }
    }

    return (
        <form action={formAction} onSubmit={rememberEmail} noValidate>
            <input
                type="email"
                name="email"
                aria-label="이메일"
                className={`mb-5 ${styles.input}`}
                placeholder="MYSHOP 이메일 입력"
                autoComplete="username"
                value={email}
                onChange={(event) => setTypedEmail(event.target.value)}
                aria-invalid={Boolean(state.errors?.email)}
                aria-describedby={
                    state.errors?.email ? 'login-email-error' : undefined
                }
            />
            {state.errors?.email && (
                <p
                    id="login-email-error"
                    role="alert"
                    className="mb-2 text-sm text-red-600"
                >
                    {state.errors.email}
                </p>
            )}
            <input
                type="password"
                name="password"
                aria-label="비밀번호"
                className={styles.input}
                placeholder="MYSHOP 비밀번호 입력 (대/소문자 구분)"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(state.errors?.password)}
                aria-describedby={
                    state.errors?.password ? 'login-password-error' : undefined
                }
            />
            {state.errors?.password && (
                <p
                    id="login-password-error"
                    role="alert"
                    className="mt-2 text-sm text-red-600"
                >
                    {state.errors.password}
                </p>
            )}
            {state.message && !state.success && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {state.message}
                </p>
            )}
            <div className="my-3 flex items-center gap-2">
                <input
                    id="saveEmail"
                    type="checkbox"
                    className="size-5 accent-black"
                    checked={saveEmail}
                    onChange={(event) => setSaveEmail(event.target.checked)}
                />
                <label htmlFor="saveEmail" className="text-sm">
                    이메일 저장
                </label>
            </div>
            <button
                type="submit"
                disabled={pending}
                className={`w-full disabled:opacity-60 ${styles.btnBlack}`}
            >
                {pending ? '로그인 중...' : 'MYSHOP 통합 회원 로그인'}
            </button>
        </form>
    );
}
