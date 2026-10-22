'use client';
import { startTransition, useActionState, useState } from 'react';
import type { SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';

import AlertModal from '@/shared/components/ui/AlertModal';
import { cn } from '@/shared/utils/cn';

import { submitVendorInquiry } from '../actions/vendorInquiry.actions';
import {
    CANCEL_REDIRECT_PATH,
    PRIVACY_POLICY_URL,
} from '../data/vendorInquiryLinks';
import { INITIAL_VENDOR_INQUIRY_STATE } from '../types/types';
import SubmitButton from './SubmitButton';
import VendorInquiryFields from './VendorInquiryFields';

const buttonClass = 'h-[52px] w-[148px] text-[16px] font-medium';

// 취소 흐름: 확인창(confirm) → "취소되었습니다." 안내(done) → 페이지 이동 (EQL comReqCancel 과 동일)
type CancelStep = 'idle' | 'confirm' | 'done';

export default function VendorInquiryForm() {
    const router = useRouter();
    const [formState, formAction, isPending] = useActionState(
        submitVendorInquiry,
        INITIAL_VENDOR_INQUIRY_STATE,
    );
    const [closedSubmissionKey, setClosedSubmissionKey] = useState<string>();
    const [cancelStep, setCancelStep] = useState<CancelStep>('idle');

    const { submissionKey, values } = formState.data ?? {};
    const isDoneModalOpen =
        Boolean(submissionKey) && submissionKey !== closedSubmissionKey;

    // React 19는 action prop으로 제출된 폼을 완료 후 자동 reset 하여
    // 제어 컴포넌트(select)의 DOM 값과 state를 어긋나게 만든다.
    // 직접 제출해 reset을 건너뛰고, action prop은 hydration 전 제출용으로 남긴다.
    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
    }

    return (
        <>
            <form
                action={formAction}
                onSubmit={handleSubmit}
                noValidate
                aria-busy={isPending}
            >
                <fieldset disabled={isPending} className="min-w-0 pt-[10px]">
                    <legend className="sr-only">문의 정보</legend>

                    {/* 등록에 성공할 때마다 submissionKey 가 바뀌어 입력칸을 새로 그린다 → 모든 값이 비워진다 */}
                    <VendorInquiryFields
                        key={submissionKey ?? 'draft'}
                        errors={formState.errors}
                        initialValues={values}
                    />

                    <p className="text-subtle relative mt-5 pl-2 text-[13px] leading-4 before:absolute before:left-0 before:content-['·']">
                        개인정보 처리에 대한 자세한 사항은{' '}
                        {PRIVACY_POLICY_URL ? (
                            <a
                                href={PRIVACY_POLICY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                EQL 개인정보처리방침
                            </a>
                        ) : (
                            'EQL 개인정보처리방침'
                        )}
                        에서 확인할 수 있습니다.
                    </p>

                    {/* 실패 안내만 여기에 보여주고, 성공 안내는 완료 모달로 보여준다 */}
                    <p
                        role="status"
                        aria-live="polite"
                        className="text-point mt-[30px] text-center text-[14px] font-medium empty:mt-0"
                    >
                        {formState.success ? '' : formState.message}
                    </p>

                    <div className="mt-[60px] flex justify-center gap-[10px]">
                        <button
                            type="button"
                            onClick={() => setCancelStep('confirm')}
                            className={cn(
                                buttonClass,
                                'border border-black bg-white',
                            )}
                        >
                            취소
                        </button>
                        <SubmitButton className={buttonClass} />
                    </div>
                </fieldset>
            </form>

            <AlertModal
                open={isDoneModalOpen}
                message={formState.message ?? ''}
                onClose={() => setClosedSubmissionKey(submissionKey)}
            />

            <AlertModal
                open={cancelStep === 'confirm'}
                title="입점 문의 취소"
                message="입력된 내용은 저장되지 않습니다. 페이지를 벗어나시겠습니까?"
                onCancel={() => setCancelStep('idle')}
                onClose={() => setCancelStep('done')}
            />

            <AlertModal
                open={cancelStep === 'done'}
                message="취소되었습니다."
                onClose={() => router.push(CANCEL_REDIRECT_PATH)}
            />
        </>
    );
}
