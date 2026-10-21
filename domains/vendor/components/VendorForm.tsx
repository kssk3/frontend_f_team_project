'use client';
import { startTransition, useActionState, useState } from 'react';
import type { FormEvent } from 'react';
import { ChevronDown } from 'lucide-react';

import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';

import { submitVendorInquiry } from '../actions/vendorInquiry.actions';
import { mockInquiryTypes } from '../data/mockInquiryTypes';
import { mockCategories } from '../data/mockCategories';
import { vendorFields } from '../types/vendorFields';
import SubmitButton from './SubmitButton';

// EQL 입점 문의 폼 기준 스타일 (라벨 160px · 입력 48px · #ccc 테두리)
const controlClass =
    'w-full border border-input bg-white text-[14px] font-medium text-[#333] outline-none placeholder:text-input focus:border-black disabled:cursor-not-allowed disabled:bg-secondary';
const buttonClass = 'h-[52px] w-[148px] text-[16px] font-medium';

export default function VendorInquiryForm() {
    const [formState, formAction, isPending] = useActionState(
        submitVendorInquiry,
        INITIAL_ACTION_STATE,
    );
    const [selectedValues, setSelectedValues] = useState({
        inquiryType: '',
        primaryCategory: '',
        secondaryCategory: '',
    });

    const secondaryOptions =
        mockCategories.find(
            (category) => category.value === selectedValues.primaryCategory,
        )?.children ?? [];

    const optionsByName = {
        inquiryType: mockInquiryTypes,
        primaryCategory: mockCategories,
        secondaryCategory: secondaryOptions,
    };

    function handleSelectChange(
        name: keyof typeof selectedValues,
        value: string,
    ) {
        setSelectedValues((prev) => {
            if (name === 'primaryCategory') {
                return {
                    ...prev,
                    primaryCategory: value,
                    secondaryCategory: '',
                };
            }

            return {
                ...prev,
                [name]: value,
            };
        });
    }

    // React 19는 action prop으로 제출된 폼을 완료 후 자동 reset 하여
    // 제어 컴포넌트(select)의 DOM 값과 state를 어긋나게 만든다.
    // 직접 제출해 reset을 건너뛰고, action prop은 hydration 전 제출용으로 남긴다.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
    }

    return (
        <form
            action={formAction}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isPending}
        >
            <fieldset disabled={isPending} className="min-w-0 pt-[10px]">
                <legend className="sr-only">문의 정보</legend>

                {vendorFields.map((field) => {
                    const error = formState.errors?.[field.name];
                    const errorId = `${field.name}-error`;
                    const isRequired = !('optional' in field);
                    const placeholder =
                        'placeholder' in field ? field.placeholder : undefined;
                    const fieldProps = {
                        id: field.name,
                        name: field.name,
                        'aria-invalid': Boolean(error),
                        'aria-describedby': error ? errorId : undefined,
                    };

                    return (
                        <div
                            key={field.name}
                            className="border-secondary flex border-b"
                        >
                            <div className="w-[160px] shrink-0 py-5">
                                <label
                                    htmlFor={field.name}
                                    className={cn(
                                        'flex items-center text-[14px] font-medium',
                                        field.kind === 'textarea'
                                            ? 'h-[100px]'
                                            : 'h-12',
                                        isRequired &&
                                            "after:ml-1 after:content-['*']",
                                    )}
                                >
                                    {field.label}
                                </label>
                            </div>

                            <div className="ml-[30px] min-w-0 flex-1 py-5">
                                {field.kind === 'input' && (
                                    <input
                                        {...fieldProps}
                                        type={field.type}
                                        placeholder={placeholder}
                                        className={cn(
                                            controlClass,
                                            'h-12 px-[15px]',
                                        )}
                                    />
                                )}

                                {field.kind === 'select' && (
                                    <div className="relative">
                                        <select
                                            {...fieldProps}
                                            value={selectedValues[field.name]}
                                            onChange={(event) =>
                                                handleSelectChange(
                                                    field.name,
                                                    event.target.value,
                                                )
                                            }
                                            disabled={
                                                field.name ===
                                                    'secondaryCategory' &&
                                                selectedValues.primaryCategory ===
                                                    ''
                                            }
                                            required
                                            className={cn(
                                                controlClass,
                                                'h-12 appearance-none pr-[34px] pl-[14px] text-black',
                                            )}
                                        >
                                            <option value="" disabled>
                                                {field.label} 선택
                                            </option>

                                            {optionsByName[field.name].map(
                                                (option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <ChevronDown
                                            aria-hidden
                                            className="pointer-events-none absolute top-1/2 right-[14px] size-[15px] -translate-y-1/2"
                                        />
                                    </div>
                                )}

                                {field.kind === 'textarea' && (
                                    <textarea
                                        {...fieldProps}
                                        rows={field.rows}
                                        placeholder={placeholder}
                                        spellCheck={false}
                                        className={cn(
                                            controlClass,
                                            'block h-[102px] resize-none px-[15px] py-[15px]',
                                        )}
                                    />
                                )}

                                {error && (
                                    <p
                                        id={errorId}
                                        className="text-point mt-[10px] text-[14px]"
                                    >
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                <p className="text-subtle relative mt-5 pl-2 text-[13px] leading-4 before:absolute before:left-0 before:content-['·']">
                    개인정보 처리에 대한 자세한 사항은 EQL 개인정보처리방침에서
                    확인할 수 있습니다.
                </p>

                <p
                    role="status"
                    aria-live="polite"
                    className={cn(
                        'mt-[30px] text-center text-[14px] font-medium empty:mt-0',
                        !formState.success && 'text-point',
                    )}
                >
                    {formState.message}
                </p>

                <div className="mt-[60px] flex justify-center gap-[10px]">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
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
    );
}
