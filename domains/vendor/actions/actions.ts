'use server';

import { z } from 'zod';

import type { VendorFormState } from '../types/types';
import { vendorInquirySchema } from '../validation';

export async function submitVendorInquiry(
    _previousState: VendorFormState,
    formData: FormData,
): Promise<VendorFormState> {
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
    const values = Object.fromEntries(
        Object.entries(rawData).map(([name, value]) => [
            name,
            typeof value === 'string' ? value : '',
        ]),
    );

    if (!result.success) {
        return {
            status: 'invalid',
            message: '입력 내용을 확인해 주세요.',
            fieldErrors: z.flattenError(result.error).fieldErrors,
            values,
        };
    }

    return {
        status: 'validated',
        message: '입력값 검증이 완료되었습니다. 아직 저장되지 않았습니다.',
        fieldErrors: {},
        values,
    };
}
