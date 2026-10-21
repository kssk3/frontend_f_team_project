'use client';

import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { signUpAction } from '../actions/signup.actions';
import { VerifiedIdentity } from '../types/auth.types';

interface FormType {
    email: string;
    password: string;
    passwordConfirm: string;
}

const initialForm: FormType = {
    email: '',
    password: '',
    passwordConfirm: '',
};

interface Props {
    identity: VerifiedIdentity;
    onSuccess: () => void;
}

const inputClass =
    'h-12 w-full rounded-[3px] border border-gray-300 px-3.5 text-sm read-only:bg-gray-50 read-only:text-gray-500';

export default function SignUpForm({ identity, onSuccess }: Props): React.JSX.Element {
    const [form, setForm] = useState<FormType>(initialForm);
    const [state, formAction, isPending] = useActionState(
        signUpAction,
        INITIAL_ACTION_STATE,
    );
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    useEffect(() => {
        if (state.success) {
            window.scrollTo({ top: 0 });
            onSuccess();
        }
    }, [state.success, onSuccess]);

    const fields = [
        { label: '이름', name: 'name', type: 'text', value: identity.name, readOnly: true },
        { label: '휴대폰 번호', name: 'phone', type: 'text', value: identity.phone, readOnly: true },
        { label: '이메일', name: 'email', type: 'email', value: form.email, placeholder: '이메일을 입력하세요.' },
        { label: '비밀번호', name: 'password', type: 'password', value: form.password, placeholder: '비밀번호를 입력하세요. (7자 이상)' },
        { label: '비밀번호 확인', name: 'passwordConfirm', type: 'password', value: form.passwordConfirm, placeholder: '비밀번호를 한 번 더 입력하세요.' },
    ];

    return (
        <section>
            <h2 className="mb-7.5 text-lg font-bold">회원정보 입력</h2>

            {state.message && !state.success && (
                <div className="mb-6 rounded-[3px] border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600">
                    {state.message}
                </div>
            )}

            <form action={formAction} autoComplete="off" className="space-y-5">
                {fields.map((f) => (
                    <div key={f.name}>
                        <label htmlFor={f.name} className="mb-2 block text-sm font-medium">
                            {f.label}
                        </label>
                        <input
                            id={f.name}
                            name={f.name}
                            type={f.type}
                            className={inputClass}
                            value={f.value}
                            placeholder={f.placeholder}
                            readOnly={f.readOnly}
                            onChange={f.readOnly ? undefined : onChange}
                        />
                        {state.errors?.[f.name] && (
                            <p className="mt-1.5 text-xs text-red-600">{state.errors[f.name]}</p>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-5 h-13 w-full rounded-[3px] bg-black font-medium text-white disabled:opacity-60"
                >
                    {isPending ? '처리중...' : '가입하기'}
                </button>
            </form>
        </section>
    );
}
