import { z } from 'zod';
import { mockCategories } from './data/mockCategories';

export const vendorInquirySchema = z
    .object({
        companyName: z
            .string({ error: '회사명을 입력해주세요.' })
            .trim()
            .min(2, { error: '회사명은 2자 이상 입력해주세요.' })
            .max(50, { error: '회사명은 50자 이하로 입력해주세요.' }),
        brandName: z
            .string({ error: '브랜드명을 입력해주세요' })
            .trim()
            .min(2, { error: '브랜드명은 2자 이상 입력해주세요' })
            .max(50, { error: '브랜드명은 50자 이하로 입력해주세요.' }),
        contactName: z
            .string({ error: '담당자명을 입력해주세요.' })
            .trim()
            .min(2, { error: '담당자명은 2자 이상 입력해주세요.' })
            .max(20, { error: '담당자명은 20자 이하로 입력해주세요.' }),
        phoneNumber: z
            .string({ error: '전화번호를 입력해주세요' })
            .trim()
            .min(1, { error: '전화번호를 입력해 주세요.' })
            .pipe(
                z.string().regex(/^[0-9]+$/, {
                    error: "전화번호는 '-'없이 숫자만 입력해주세요.",
                }),
            ),
        inquiryType: z.enum(['rental', 'vendor'], {
            error: '문의 유형을 선택해 주세요.',
        }),
        primaryCategory: z.enum(['women', 'men', 'life'], {
            error: '대표 카테고리를 선택해 주세요.',
        }),
        secondaryCategory: z
            .string({ error: '2차 카테고리를 선택해 주세요.' })
            .trim()
            .min(1, { error: '2차 카테고리를 선택해 주세요.' }),
        mobileNumber: z
            .string({ error: '담당자 휴대폰 번호를 입력해주세요.' })
            .trim()
            .min(1, { error: '담당자 휴대폰 번호를 입력해주세요.' })
            .pipe(
                z.string().regex(/^[0-9]+$/, {
                    error: "휴대폰 번호는 '-' 없이 숫자만 입력해주세요.",
                }),
            ),
        email: z
            .string({ error: '이메일을 입력해주세요' })
            .trim()
            .min(1, { error: '이메일을 입력해주세요.' })
            .pipe(z.email({ error: '올바른 이메일을 입력해주세요.' })),
        website: z
            .string({ error: '브랜드 웹사이트를 입력해주세요.' })
            .trim()
            .min(1, { error: '브랜드 웹사이트를 입력해주세요.' })
            .pipe(z.url({ error: '올바른 웹사이트 주소를 입력해주세요.' })),
        otherPlatforms: z.string().trim(),
        content: z.string().trim(),
    })
    .refine(
        (data) => {
            const selectedCategory = mockCategories.find(
                (category) => category.value === data.primaryCategory,
            );

            return (
                selectedCategory?.children.some(
                    (child) => child.value === data.secondaryCategory,
                ) ?? false
            );
        },
        {
            path: ['secondaryCategory'],
            error: '대표 카테고리에 맞는 2차 카테고리를 선택해 주세요.',
        },
    );
