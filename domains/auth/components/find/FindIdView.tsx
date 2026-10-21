'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { VerifiedIdentity } from '../../types/auth.types';
import { findIdAction, FoundAccount } from '../../actions/findAccount.actions';
import IdentityVerification from '../signup/IdentityVerification';

export default function FindIdView() {
    const [accounts, setAccounts] = useState<FoundAccount[] | null>(null);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const onVerified = (identity: VerifiedIdentity) => {
        setError('');
        startTransition(async () => {
            const result = await findIdAction(identity.name, identity.phone);
            if (result.success && result.data) setAccounts(result.data);
            else setError(result.message ?? '조회에 실패했습니다.');
        });
    };

    if (accounts) {
        return (
            <>
                <div className="mb-12.5 text-center">
                    <h1 className="text-[34px] font-bold">아이디 찾기</h1>
                    <p className="mt-4 text-sm">
                        회원님의 정보와 일치하는 아이디입니다.
                    </p>
                </div>

                <ul className="border-y border-gray-200">
                    {accounts.map((a) => (
                        <li
                            key={a.maskedEmail}
                            className="flex items-center justify-between border-gray-100 px-5 py-5 not-last:border-b"
                        >
                            <span className="font-medium">{a.maskedEmail}</span>
                            <span className="text-[13px] text-gray-500">
                                가입일{' '}
                                {new Date(a.joinedAt).toLocaleDateString(
                                    'ko-KR',
                                )}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="mt-12.5 grid grid-cols-2 gap-2.5">
                    <Link
                        href="/member/find-pw"
                        className="flex h-13 items-center justify-center rounded-[3px] border border-black font-medium"
                    >
                        비밀번호 찾기
                    </Link>
                    <Link
                        href="/login"
                        className="flex h-13 items-center justify-center rounded-[3px] bg-black font-medium text-white"
                    >
                        로그인
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="mb-12.5 text-center">
                <h1 className="text-[34px] font-bold">아이디 찾기</h1>
                <p className="mt-4 text-sm">
                    아이디를 찾기 위해 인증 방법을 선택해 주세요.
                </p>
            </div>

            <IdentityVerification compact onVerified={onVerified} />

            {isPending && (
                <p className="mt-5 text-center text-sm text-gray-500">
                    조회 중...
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
        </>
    );
}
