// 상품 문의 등록 폼 — 훅(useActionState · useState)을 쓰므로 클라이언트 컴포넌트 (s53 §15-3)
'use client';

import Link from 'next/link';
import { startTransition, useActionState, useState } from 'react';
import type { FormEvent } from 'react';

import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';

import { createInquiryAction } from '../actions/inquiry.actions';
import { INQUIRY_MAX_LENGTH } from '../utils/inquiry.utils';

interface InquiryFormProps {
    productId: string;
    phone: string; // users.phone — 표시만 한다. 빈 문자열이면 등록된 번호 없음
}

const labelClass = 'block text-base font-bold';
const errorClass = 'mt-2 text-xs text-red-600';

export default function InquiryForm({ productId, phone }: InquiryFormProps) {
    const [state, formAction, isPending] = useActionState(
        createInquiryAction,
        INITIAL_ACTION_STATE,
    );
    // 제출이 실패해도 입력이 지워지지 않게 전부 제어 컴포넌트로 (s53 §25)
    // React 19 는 action 이 끝나면 비제어 입력을 초기화한다 → 라디오·체크박스까지 state 에 둔다
    const [content, setContent] = useState('');
    const [notify, setNotify] = useState(true);
    const [isPublic, setIsPublic] = useState(true);
    const errors = state.errors ?? {};

    // React 19 는 action 으로 제출된 폼을 액션이 끝나면 자동으로 reset 한다 → 제어 라디오·체크박스의 DOM 이 state 와 어긋난다
    // (검증 실패 뒤 「비공개」가 「공개」로 보이는 실측, 2026-10-21). 입점 문의 폼과 같은 방법으로 직접 제출해 reset 을 건너뛴다.
    // action 속성은 JS 가 뜨기 전 제출용으로 남긴다
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
    }

    return (
        // method 를 적지 않는다 (s53 §12-3) · noValidate = 브라우저 기본 팝업 대신 우리 메시지
        <form action={formAction} onSubmit={handleSubmit} noValidate className="mt-8">
            {/* 제출 중에는 전체를 비활성 — 두 번 눌러 두 번 등록되는 것을 막는다 (입점 문의 폼 선례) */}
            <fieldset disabled={isPending} className="flex flex-col gap-8">
                <input type="hidden" name="productId" value={productId} />

                <div>
                    <label htmlFor="inquiry-content" className={labelClass}>
                        문의 내용 <span aria-hidden>*</span>
                    </label>
                    <div className="relative mt-3">
                        <textarea
                            id="inquiry-content"
                            name="content" // 액션의 formData.get('content') · errors.content 와 같은 이름
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={INQUIRY_MAX_LENGTH}
                            placeholder="문의하실 내용을 입력해주세요. (특수문자 \/:<>는 사용할 수 없습니다.)"
                            aria-invalid={Boolean(errors.content)}
                            aria-describedby={errors.content ? 'inquiry-content-error' : undefined}
                            className="w-full resize-none border border-neutral-300 p-4 pb-8 text-sm outline-none focus:border-neutral-900"
                        />
                        {/* EQL 의 0/1,000 카운터 */}
                        <span className="pointer-events-none absolute right-4 bottom-4 text-xs text-neutral-400">
                            {content.length.toLocaleString()}/{INQUIRY_MAX_LENGTH.toLocaleString()}
                        </span>
                    </div>
                    {errors.content && (
                        <p id="inquiry-content-error" className={errorClass}>
                            {errors.content}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="inquiry-phone" className={labelClass}>
                        답변알림 수신 휴대폰 번호 <span aria-hidden>*</span>
                    </label>
                    {/* name 이 없어 제출되지 않는다 — 회원 번호를 보여 주기만 한다 */}
                    <input
                        id="inquiry-phone"
                        type="tel"
                        value={phone || '등록된 번호가 없습니다'}
                        readOnly
                        className="mt-3 h-12 w-full border border-neutral-300 bg-neutral-50 px-4 text-sm text-neutral-700"
                    />
                    <label className="mt-3 flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="notify" // 체크됐을 때만 'on' 으로 전송된다
                            checked={notify}
                            onChange={(e) => setNotify(e.target.checked)}
                            className="size-4"
                        />
                        답변 알림 받기
                    </label>
                </div>

                <fieldset>
                    <legend className={labelClass}>
                        공개여부 <span aria-hidden>*</span>
                    </legend>
                    <div className="mt-3 flex gap-6 text-sm">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="isPublic"
                                value="true"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                            />
                            공개
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="isPublic"
                                value="false"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                            />
                            비공개
                        </label>
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                        · 공개로 설정하시면 다른 고객님들께 도움을 줄 수 있습니다.
                    </p>
                </fieldset>

                <div>
                    <h2 className="text-base font-bold">문의 시 유의사항</h2>
                    <ul className="mt-2 space-y-1 text-xs text-neutral-500">
                        <li>· 배송, 교환/반품/취소에 대한 문의는 My Page &gt; 1:1문의를 통해 접수 부탁드립니다.</li>
                        <li>· 상품과 관련없는 내용, 비방, 광고, 불건전한 내용의 글은 사전 동의없이 삭제될 수 있습니다.</li>
                        <li>· 작성하신 문의는 My Page &gt; 상품 Q&amp;A에서 확인하실 수 있습니다.</li>
                    </ul>
                </div>

                {/* 칸이 아닌 양식 전체의 실패 — 로그인 만료 · 저장 실패 */}
                {errors.login && (
                    <p className="text-sm text-red-600">
                        {errors.login}{' '}
                        <Link href="/login" className="underline">
                            로그인
                        </Link>
                    </p>
                )}
                {!state.success && state.message && (
                    <p role="status" className="text-sm text-red-600">
                        {state.message}
                    </p>
                )}

                {/* EQL 하단 바 — 취소 / 등록 반반 */}
                <div className="grid grid-cols-2">
                    <Link
                        href={`/product/${productId}#faq`}
                        className="flex h-14 items-center justify-center border border-neutral-900 text-sm font-bold"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
                        className="h-14 bg-neutral-900 text-sm font-bold text-white disabled:bg-neutral-400"
                    >
                        {isPending ? '등록 중…' : '등록'}
                    </button>
                </div>
            </fieldset>
        </form>
    );
}
