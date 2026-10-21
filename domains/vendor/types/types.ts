import type { z } from 'zod';

import type { vendorInquirySchema } from '../utils/vendorValidation';

export type VendorInquiryInput = z.infer<typeof vendorInquirySchema>;

export type VendorFieldErrors = Partial<
    Record<keyof VendorInquiryInput, string[]>
>;

export type VendorFormState = {
    status: 'idle' | 'invalid' | 'validated';
    message: string;
    fieldErrors: VendorFieldErrors;
    values?: Partial<Record<keyof VendorInquiryInput, string>>;
};
