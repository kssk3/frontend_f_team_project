'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/shared/lib/supabase';
import useFormState from '@/shared/hooks/useFormState';

type Status = 'checking' | 'ready' | 'invalid' | 'done';

const inputClass =
    'h-12 w-full rounded-[3px] border border-gray-300 px-3.5 text-sm';

export default function ResetPasswordView() {
    const [status, setStatus] = useState<Status>('checking');
    const [form, onChange] = useFormState({
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    // 브라우저 클라이언트가 URL의 ?code= 를 세션으로 교환해 준다.
    // getSession()은 그 교환이 끝날 때까지 기다린다.
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setStatus(data.session ? 'ready' : 'invalid');
        });
    }, []);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.password.length < 7) {
            return setError('비밀번호는 최소 7자 이상이어야 합니다.');
        }
        if (form.password !== form.passwordConfirm) {
            return setError('비밀번호가 일치하지 않습니다.');
        }
        setError('');
        setIsPending(true);
        const { error: updateError } = await supabase.auth.updateUser({
            password: form.password,
        });
        setIsPending(false);
        if (updateError) {
            return setError(`변경에 실패했습니다: ${updateError.message}`);
        }
        // 재설정용 세션은 끊고 새 비밀번호로 다시 로그인하게 한다
        await supabase.auth.signOut();
        setStatus('done');
    };

    return (
        <>
            <div className="mb-15 text-center">
                <h1 className="text-[34px] font-bold">비밀번호 재설정</h1>
                <p className="mt-4 text-sm">
                    {status === 'done'
                        ? '비밀번호가 변경되었습니다.'
                        : '새로 사용할 비밀번호를 입력해 주세요.'}
                </p>
            </div>

            {status === 'checking' && (
                <p className="text-center text-sm text-gray-500">확인 중...</p>
            )}

            {status === 'invalid' && (
                <div className="text-center">
                    <p className="bg-gray-50 p-5 text-sm">
                        링크가 만료되었거나 올바르지 않습니다. 다시 요청해
                        주세요.
                    </p>
                    <Link
                        href="/member/find-pw"
                        className="mt-12.5 flex h-13 items-center justify-center rounded-[3px] bg-black font-medium text-white"
                    >
                        비밀번호 찾기
                    </Link>
                </div>
            )}

            {status === 'ready' && (
                <form onSubmit={onSubmit} className="space-y-5">
                    <input
                        name="password"
                        type="password"
                        placeholder="새 비밀번호 (7자 이상)"
                        autoComplete="new-password"
                        className={inputClass}
                        value={form.password}
                        onChange={onChange}
                    />
                    <input
                        name="passwordConfirm"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        autoComplete="new-password"
                        className={inputClass}
                        value={form.passwordConfirm}
                        onChange={onChange}
                    />
                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-10 h-13 w-full rounded-[3px] bg-black font-medium text-white disabled:opacity-60"
                    >
                        {isPending ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </form>
            )}

            {status === 'done' && (
                <Link
                    href="/login"
                    className="flex h-13 items-center justify-center rounded-[3px] bg-black font-medium text-white"
                >
                    로그인
                </Link>
            )}
        </>
    );
}
