'use client';

import { useState } from 'react';
import { Check, ChevronRight, X } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from '@/shared/components/ui/dialog';

// 약관 항목 (제목 / 내용)
const TERMS = [
    { title: '제공받는 자', content: '연대백화점 (MYSHOP 운영사)' },
    {
        title: '제공받는 목적',
        content: 'MYSHOP 통합회원 계정 연동, 멤버십 서비스 제공, 중복 가입여부 확인',
    },
    { title: '제공 항목', content: '이름, 생년월일, 휴대폰번호, CI(연계정보)' },
    { title: '보유기간', content: '회원탈퇴 또는 동의 철회시 까지' },
];

interface Props {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function AgreementSection({ checked, onChange }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <section className="mb-17.5">
            <h2 className="mb-7.5 text-lg font-bold">제공 동의</h2>

            <div className="flex items-center justify-between border border-gray-200 px-5 py-5">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                    {/* 기본 체크박스 모양은 숨기고(appearance-none) 회색 테두리 상자 + 검은 체크 아이콘으로 표시 */}
                    <span className="relative grid size-5 shrink-0 place-items-center">
                        {/* 뒤로가기로 돌아오면 브라우저가 DOM 체크 상태만 복원해 React 상태와 어긋난다.
                            → 복원을 끄고(autoComplete off), 표시·토글 모두 React 상태(checked) 기준으로 */}
                        <input
                            type="checkbox"
                            autoComplete="off"
                            className="size-5 cursor-pointer appearance-none border border-gray-300 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                            checked={checked}
                            onChange={() => onChange(!checked)}
                        />
                        {checked && (
                            <Check
                                size={14}
                                strokeWidth={2}
                                aria-hidden
                                className="pointer-events-none absolute"
                            />
                        )}
                    </span>
                    개인정보 제3자 제공 동의(필수)
                </label>
                <button
                    type="button"
                    aria-label="약관 보기"
                    onClick={() => setOpen(true)}
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="flex max-h-[90vh] flex-col gap-0 rounded-none p-0 ring-0 sm:max-w-3xl"
                >
                    {/* 상단 바 : 가운데 제목 + 우측 닫기 */}
                    <div className="relative flex h-15 shrink-0 items-center justify-center border-b border-gray-200">
                        <DialogTitle className="text-lg font-bold">
                            개인정보 제3자 제공 동의
                        </DialogTitle>
                        <DialogClose
                            aria-label="닫기"
                            className="absolute right-5 p-1"
                        >
                            <X size={26} strokeWidth={1.5} />
                        </DialogClose>
                    </div>

                    {/* 본문 : 내용이 길면 이 영역만 스크롤 */}
                    <div className="overflow-y-auto px-10 py-11 text-sm leading-6 text-gray-900">
                        <h3 className="mb-12 text-lg font-bold">
                            MYSHOP 통합회원가입 개인정보 제3자 제공 동의
                        </h3>

                        <h4 className="mb-4 text-base font-bold">
                            MYSHOP 개인정보 제3자 제공 동의(필수)
                        </h4>
                        <p className="mb-11">
                            MYSHOP은 정보주체의 동의를 받아 &lsquo;MYSHOP&rsquo; 통합회원 계정 연동, 멤버십 서비스 제공, 중복 가입여부 확인의 목적으로 동의하신 고객님에 한하여 최소한의 개인정보가 제3자에게 제공됩니다.
                        </p>

                        <dl className="space-y-5">
                            {TERMS.map((term, i) => (
                                <div key={term.title}>
                                    <dt className="mb-1.5 text-base font-bold">
                                        {i + 1}. {term.title}
                                    </dt>
                                    <dd className="underline underline-offset-4">
                                        {term.content}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <p className="mt-12">
                            위의 개인정보 제3자 제공에 대한 동의를 거부할 권리가 있습니다. 그러나 동의를 거부할 경우 MYSHOP 통합회원가입에 제한을 받을 수 있습니다.
                        </p>
                    </div>

                    {/* 하단 고정 버튼 */}
                    <div className="shrink-0 border-t border-gray-200 px-10 py-5">
                        <button
                            type="button"
                            className="h-12 w-full bg-black text-white"
                            onClick={() => {
                                onChange(true);
                                setOpen(false);
                            }}
                        >
                            동의
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
