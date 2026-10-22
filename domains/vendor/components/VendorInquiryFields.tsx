'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

import { mockCategories } from '../data/mockCategories';
import { mockInquiryTypes } from '../data/mockInquiryTypes';
import type { VendorInquiryValues } from '../types/types';
import { vendorFields } from '../types/vendorFields';

// EQL 입점 문의 폼 기준 스타일 (라벨 160px · 입력 48px · #ccc 테두리)
const controlClass =
    'w-full border border-input bg-white text-[14px] font-medium text-[#333] outline-none placeholder:text-input focus:border-black disabled:cursor-not-allowed disabled:bg-secondary';

interface VendorInquiryFieldsProps {
    errors?: Record<string, string>;
    initialValues?: VendorInquiryValues;
}

export default function VendorInquiryFields({
    errors,
    initialValues,
}: VendorInquiryFieldsProps) {
    const [selectedValues, setSelectedValues] = useState(() => ({
        inquiryType: initialValues?.inquiryType ?? '',
        primaryCategory: initialValues?.primaryCategory ?? '',
        secondaryCategory: initialValues?.secondaryCategory ?? '',
    }));

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

    return vendorFields.map((field) => {
        const error = errors?.[field.name];
        const errorId = `${field.name}-error`;
        const isRequired = !('optional' in field);
        const placeholder =
            'placeholder' in field ? field.placeholder : undefined;
        const fieldProps = {
            id: field.name,
            name: field.name,
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? errorId : undefined,
            // 화면의 * 표시를 보조기기에도 알린다
            'aria-required': isRequired || undefined,
        };

        return (
            <div key={field.name} className="border-secondary flex border-b">
                <div className="w-[160px] shrink-0 py-5">
                    <label
                        htmlFor={field.name}
                        className={cn(
                            'flex items-center text-[14px] font-medium',
                            field.kind === 'textarea' ? 'h-[100px]' : 'h-12',
                            isRequired && "after:ml-1 after:content-['*']",
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
                            maxLength={
                                'maxLength' in field
                                    ? field.maxLength
                                    : undefined
                            }
                            defaultValue={initialValues?.[field.name] ?? ''}
                            className={cn(controlClass, 'h-12 px-[15px]')}
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
                                    field.name === 'secondaryCategory' &&
                                    selectedValues.primaryCategory === ''
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

                                {optionsByName[field.name].map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
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
                            maxLength={field.maxLength}
                            spellCheck={false}
                            defaultValue={initialValues?.[field.name] ?? ''}
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
    });
}
