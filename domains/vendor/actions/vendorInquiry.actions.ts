'use server';

import { z } from 'zod';

import type { ActionState } from '@/shared/types/action.types';

import type { VendorInquiryValues } from '../types/types';
import { vendorInquirySchema } from '../utils/vendorValidation';

export async function submitVendorInquiry(
    _previousState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const rawData = {
        companyName: formData.get('companyName'),
        brandName: formData.get('brandName'),
        contactName: formData.get('contactName'),
        phoneNumber: formData.get('phoneNumber'),
        inquiryType: formData.get('inquiryType'),
        primaryCategory: formData.get('primaryCategory'),
        secondaryCategory: formData.get('secondaryCategory'),
        mobileNumber: formData.get('mobileNumber'),
        email: formData.get('email'),
        website: formData.get('website'),
        otherPlatforms: formData.get('otherPlatforms') ?? '',
        content: formData.get('content') ?? '',
    };
    const result = vendorInquirySchema.safeParse(rawData);

    if (!result.success) {
        // 팀 공통 형태(ActionState.errors)에 맞춰 필드마다 첫 번째 메시지만 전달
        const { fieldErrors } = z.flattenError(result.error);
        const errors: Record<string, string> = {};
        for (const [name, messages] of Object.entries(fieldErrors)) {
            if (messages?.[0]) errors[name] = messages[0];
        }

        // JS 로드 전(hydration 전) 제출은 새로 그린 폼에 값이 없으므로, 입력값을 돌려줘 다시 채운다
        const values: VendorInquiryValues = Object.fromEntries(
            Object.entries(rawData).map(([name, value]) => [
                name,
                typeof value === 'string' ? value : '',
            ]),
        );

        return {
            success: false,
            message: '입력 내용을 확인해 주세요.',
            errors,
            data: values,
        };
    }

    return {
        success: true,
        message: '입력값 검증이 완료되었습니다. 아직 저장되지 않았습니다.',
    };
}
