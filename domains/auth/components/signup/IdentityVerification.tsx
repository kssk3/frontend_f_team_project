'use client';

import { useState } from 'react';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { Smartphone } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import AlertModal from '@/shared/components/ui/AlertModal';
import { VerifiedIdentity } from '../../types/auth.types';
import {
    NAME_INVALID_CHARS,
    validateBirth,
    validateName,
} from '../../utils/authValidation';
import { KAKAO_LOGIN_URL, NAVER_LOGIN_URL } from '../../lib/socialLogin';

// 실제 본인인증(PASS/NICE 등)은 사업자 계약이 필요하므로 목업으로 대체
const MOCK_CODE = '761435';

interface Props {
    disabled?: boolean;
    // true면 '본인인증' 제목과 하단 안내 문구 없이 버튼만 표시 (아이디/비밀번호 찾기용)
    compact?: boolean;
    onVerified: (identity: VerifiedIdentity) => void;
}

const inputClass =
    'h-12 w-full rounded-[3px] border border-gray-300 px-3.5 text-sm';

export default function IdentityVerification({
    disabled = false,
    compact = false,
    onVerified,
}: Props) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        birth: '',
        phone: '',
        code: '',
    });
    const [codeSent, setCodeSent] = useState(false);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // 이름 칸은 숫자·특수문자를 입력하는 즉시 지운다
        const next =
            name === 'name' ? value.replace(NAME_INVALID_CHARS, '') : value;
        setForm((prev) => ({ ...prev, [name]: next }));
    };

    const guard = () => {
        if (disabled) {
            setAlertMessage('개인정보 제공 동의에 동의해주세요.');
            return false;
        }
        return true;
    };

    const onClickPhone = () => {
        if (!guard()) return;
        setForm({ name: '', birth: '', phone: '', code: '' });
        setCodeSent(false);
        setError('');
        setOpen(true);
    };

    // 네이버/카카오는 로그인 페이지와 같은 소셜 로그인 주소로 이동
    const onClickSocial = (url: string) => {
        if (!guard()) return;
        window.location.href = url;
    };

    const sendCode = () => {
        const nameError = validateName(form.name);
        if (nameError) return setError(nameError);
        const birthError = validateBirth(form.birth);
        if (birthError) return setError(birthError);
        if (!/^01\d{8,9}$/.test(form.phone))
            return setError('휴대폰 번호를 숫자만 입력해 주세요.');
        setError('');
        setCodeSent(true);
        setAlertMessage(`[테스트] 인증번호는 ${MOCK_CODE} 입니다.`);
    };

    const verify = () => {
        if (form.code !== MOCK_CODE)
            return setError('인증번호가 일치하지 않습니다.');
        setOpen(false);
        onVerified({
            method: 'phone',
            name: form.name.trim(),
            birth: form.birth,
            phone: form.phone,
        });
    };

    const methods = [
        {
            label: '네이버 간편 인증',
            icon: <SiNaver size={24} />,
            onClick: () => onClickSocial(NAVER_LOGIN_URL),
        },
        {
            label: '카카오 간편 인증',
            icon: <RiKakaoTalkFill size={30} />,
            onClick: () => onClickSocial(KAKAO_LOGIN_URL),
        },
        {
            label: '휴대폰 인증',
            icon: <Smartphone size={30} />,
            onClick: onClickPhone,
        },
    ];

    return (
        <section>
            {!compact && (
                <div className="mb-7.5 flex items-end justify-between">
                    <h2 className="text-lg font-bold">본인인증</h2>
                    <p className="text-[13px] text-gray-400">
                        네이버, 카카오 간편가입으로 10초 만에 가입 완료!
                    </p>
                </div>
            )}

            <div className="grid grid-cols-3 border border-gray-300">
                {methods.map((m) => (
                    <button
                        key={m.label}
                        type="button"
                        onClick={m.onClick}
                        className="flex h-36 flex-col items-center justify-center gap-5 border-gray-300 text-sm not-last:border-r hover:bg-gray-50"
                    >
                        <span className="flex h-8 items-center">{m.icon}</span>
                        {m.label}
                    </button>
                ))}
            </div>

            {!compact && (
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-500">
                    <li>· 회원가입은 만 14세 이상만 가입 가능합니다.</li>
                    <li>
                        · 회원가입 여부 확인을 위해 아래 정보로 조회가
                        진행됩니다.
                        <br />
                        <span className="ps-2">
                            *조회정보 : 이름, 성별, 휴대폰번호, 생년월일, CI
                        </span>
                    </li>
                </ul>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="gap-3 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>휴대폰 인증</DialogTitle>
                    </DialogHeader>
                    <input
                        name="name"
                        placeholder="이름"
                        className={inputClass}
                        value={form.name}
                        onChange={onChange}
                    />
                    <input
                        name="birth"
                        placeholder="생년월일 8자리 (예: 19990101)"
                        inputMode="numeric"
                        maxLength={8}
                        className={inputClass}
                        value={form.birth}
                        onChange={onChange}
                    />
                    <div className="flex gap-2">
                        <input
                            name="phone"
                            placeholder="휴대폰 번호 (- 없이)"
                            inputMode="numeric"
                            maxLength={11}
                            className={inputClass}
                            value={form.phone}
                            onChange={onChange}
                        />
                        <button
                            type="button"
                            onClick={sendCode}
                            className="shrink-0 rounded-[3px] border border-black px-4 text-sm"
                        >
                            {codeSent ? '재전송' : '인증번호 받기'}
                        </button>
                    </div>
                    {codeSent && (
                        <input
                            name="code"
                            placeholder="인증번호 6자리"
                            inputMode="numeric"
                            maxLength={6}
                            className={inputClass}
                            value={form.code}
                            onChange={onChange}
                        />
                    )}
                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={verify}
                        disabled={!codeSent}
                        className="h-12 rounded-[3px] bg-black text-white disabled:opacity-40"
                    >
                        인증 완료
                    </button>
                </DialogContent>
            </Dialog>

            <AlertModal
                open={alertMessage !== ''}
                message={alertMessage}
                onClose={() => setAlertMessage('')}
            />
        </section>
    );
}
