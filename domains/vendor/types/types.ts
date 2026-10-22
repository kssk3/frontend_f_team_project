import type { z } from 'zod';

import type { ActionState } from '@/shared/types/action.types';

import type { vendorInquirySchema } from '../utils/vendorValidation';

export type VendorInquiryInput = z.infer<typeof vendorInquirySchema>;

export type VendorInquiryValues = Partial<
    Record<keyof VendorInquiryInput, string>
>;

// 입점 문의 액션이 ActionState.data 로 돌려주는 값
export type VendorInquiryData = {
    // 실패: JS 로드 전(hydration 전) 제출은 새로 그린 폼에 값이 없으므로 이 값으로 다시 채운다
    values?: VendorInquiryValues;
    // 성공: 제출마다 새 값. 폼이 이 값을 key 로 써서 새로 그려지며 입력값이 비워진다
    submissionKey?: string;
};

export type VendorInquiryState = ActionState<VendorInquiryData>;

// 팀 INITIAL_ACTION_STATE 와 같은 값 (data 타입만 입점 문의용)
export const INITIAL_VENDOR_INQUIRY_STATE: VendorInquiryState = {
    success: false,
};
