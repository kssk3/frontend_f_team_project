import type { z } from 'zod';

import type { vendorInquirySchema } from '../utils/vendorValidation';

export type VendorInquiryInput = z.infer<typeof vendorInquirySchema>;

// 검증 실패 시 폼을 다시 채우기 위해 돌려주는 제출 문자열 (ActionState.data)
export type VendorInquiryValues = Partial<
    Record<keyof VendorInquiryInput, string>
>;
