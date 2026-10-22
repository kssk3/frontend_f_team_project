'use client';

import { SubmitEvent, useState, useTransition } from 'react';
import Link from 'next/link';
import useFormState from '@/shared/hooks/useFormState';
import { VerifiedIdentity } from '../../types/auth.types';
import { EMAIL_REGEX, validateName } from '../../utils/authValidation';
import { requestPasswordResetAction } from '../../actions/findAccount.actions';
import IdentityVerification from '../signup/IdentityVerification';

type Step = 'input' | 'verify' | 'sent';

const inputClass =
    'h-12 w-full rounded-[3px] border border-gray-300 px-3.5 text-sm';

const SUBTITLE: Record<Step, string> = {
    input: '비밀번호를 찾으려는 아이디(이메일)를 입력해 주세요.',
    verify: '본인 확인을 위해 인증 방법을 선택해 주세요.',
    sent: '메일함에서 비밀번호 재설정 링크를 확인해 주세요.',
};

export default function FindPasswordView() {
    const [step, setStep] = useState<Step>('input');
    const [form, onChange] = useFormState({ email: '', name: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    const onNext = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!EMAIL_REGEX.test(form.email.trim())) {
            return setError('올바른 이메일 형식이 아닙니다.');
        }
        const nameError = validateName(form.name);
        if (nameError) {
            return setError(nameError);
        }
        setError('');
        setStep('verify');
    };

    const onVerified = (identity: VerifiedIdentity) => {
        setError('');
        startTransition(async () => {
            const result = await requestPasswordResetAction(
                form.email,
                form.name,
                identity.phone,
            );
            if (result.success) {
                setMessage(result.message ?? '');
                setStep('sent');
            } else {
                setError(result.message ?? '요청에 실패했습니다.');
            }
        });
    };

    return (
        <>
            <div className="mb-15 text-center">
                <h1 className="text-[34px] font-bold">비밀번호 찾기</h1>
                <p className="mt-4 text-sm">{SUBTITLE[step]}</p>
            </div>

            {step === 'input' && (
                <form onSubmit={onNext} noValidate>
                    <div className="space-y-5">
                        <input
                            name="email"
                            type="email"
                            placeholder="아이디(이메일)"
                            className={inputClass}
                            value={form.email}
                            onChange={onChange}
                        />
                        <input
                            name="name"
                            placeholder="이름"
                            className={inputClass}
                            value={form.name}
                            onChange={onChange}
                        />
                    </div>
                    {error && (
                        <p role="alert" className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="mt-15 h-13 w-full rounded-[3px] bg-black font-medium text-white"
                    >
                        다음
                    </button>
                </form>
            )}

            {step === 'verify' && (
                <>
                    <IdentityVerification compact onVerified={onVerified} />
                    {isPending && (
                        <p className="mt-5 text-center text-sm text-gray-500">
                            확인 중...
                        </p>
                    )}
                    {error && (
                        <p
                            role="alert"
                            className="mt-5 text-center text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}
                    <button
                        type="button"
                        className="mt-7.5 w-full text-center text-sm text-gray-500 underline underline-offset-2"
                        onClick={() => {
                            setError('');
                            setStep('input');
                        }}
                    >
                        이메일 다시 입력하기
                    </button>
                </>
            )}

            {step === 'sent' && (
                <>
                    <p className="bg-gray-50 p-5 text-center text-sm">
                        {message}
                    </p>
                    <Link
                        href="/login"
                        className="mt-12.5 flex h-13 items-center justify-center rounded-[3px] bg-black font-medium text-white"
                    >
                        로그인으로 이동
                    </Link>
                </>
            )}
        </>
    );
}
