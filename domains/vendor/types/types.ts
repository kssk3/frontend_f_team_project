import type { z } from 'zod';

import type { vendorInquirySchema } from '../utils/vendorValidation';

export type VendorInquiryInput = z.infer<typeof vendorInquirySchema>;
