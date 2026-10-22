'use server';

import { z } from 'zod';

import { createServerClient } from '@/shared/lib/supabase';

import type {
    VendorInquiryInput,
    VendorInquiryState,
    VendorInquiryValues,
} from '../types/types';
import { vendorFields } from '../types/vendorFields';
import { vendorInquirySchema } from '../utils/vendorValidation';

const SUCCESS_MESSAGE = '정상적으로 문의가 등록되었습니다.';
const INVALID_MESSAGE = '입력 내용을 확인해 주세요.';
const SAVE_FAILED_MESSAGE =
    '문의 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

// 폼 이름(camelCase) → DB 컬럼(snake_case)
function toRow(input: VendorInquiryInput) {
    return {
        company_name: input.companyName,
        brand_name: input.brandName,
        contact_name: input.contactName,
        phone: input.phoneNumber,
        inquiry_type: input.inquiryType,
        primary_category: input.primaryCategory,
        secondary_category: input.secondaryCategory,
        mobile: input.mobileNumber,
        email: input.email,
        website: input.website,
        other_platforms: input.otherPlatforms,
        content: input.content,
    };
}

export async function submitVendorInquiry(
    _previousState: VendorInquiryState,
    formData: FormData,
): Promise<VendorInquiryState> {
    const rawData = Object.fromEntries(
        vendorFields.map((field) => [
            field.name,
            // 선택 입력칸은 비어 있어도 되므로 빈 문자열로 받는다
            formData.get(field.name) ?? ('optional' in field ? '' : null),
        ]),
    );

    const values: VendorInquiryValues = Object.fromEntries(
        Object.entries(rawData).map(([name, value]) => [
            name,
            typeof value === 'string' ? value : '',
        ]),
    );

    const result = vendorInquirySchema.safeParse(rawData);

    if (!result.success) {
        // 팀 공통 형태(ActionState.errors)에 맞춰 필드마다 첫 번째 메시지만 전달
        const { fieldErrors } = z.flattenError(result.error);
        const errors: Record<string, string> = {};
        for (const [name, messages] of Object.entries(fieldErrors)) {
            if (messages?.[0]) errors[name] = messages[0];
        }

        return {
            success: false,
            message: INVALID_MESSAGE,
            errors,
            data: { values },
        };
    }

    const supabase = createServerClient();

    // RLS 는 insert 만 허용하므로 .select() 를 붙이지 않는다 (조회 권한 없음)
    const { error } = await supabase
        .from('vendor_inquiries')
        .insert(toRow(result.data));

    if (error) {
        // DB 오류 원문은 사용자에게 보여주지 않고 서버 로그로만 남긴다
        console.error('[vendor-inquiry] insert failed:', error.code);
        return {
            success: false,
            message: SAVE_FAILED_MESSAGE,
            data: { values },
        };
    }

    return {
        success: true,
        message: SUCCESS_MESSAGE,
        data: { submissionKey: crypto.randomUUID() },
    };
}
