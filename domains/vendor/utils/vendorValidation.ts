import { z } from 'zod';
import { mockCategories } from '../data/mockCategories';

// 입력칸 maxLength 와 서버 검증이 같은 상한을 쓰도록 한 곳에서 정한다
export const VENDOR_TEXT_MAX_LENGTH = {
    companyName: 50,
    brandName: 50,
    contactName: 20,
} as const;

// 회사명·브랜드명·담당자명: 필수 → 2자 이상 → 상한 순서로 검사
function nameField(label: string, max: number) {
    return z
        .string({ error: `${label}을 입력해 주세요.` })
        .trim()
        .min(1, { error: `${label}을 입력해 주세요.` })
        .min(2, { error: `${label}은 2자 이상 입력해 주세요.` })
        .max(max, { error: `${label}은 ${max}자 이하로 입력해 주세요.` });
}

export const vendorInquirySchema = z
    .object({
        companyName: nameField('회사명', VENDOR_TEXT_MAX_LENGTH.companyName),
        brandName: nameField('브랜드명', VENDOR_TEXT_MAX_LENGTH.brandName),
        contactName: nameField('담당자명', VENDOR_TEXT_MAX_LENGTH.contactName),
        phoneNumber: z
            .string({ error: '전화번호를 입력해 주세요.' })
            .trim()
            .min(1, { error: '전화번호를 입력해 주세요.' })
            .pipe(
                z.string().regex(/^[0-9]+$/, {
                    error: "전화번호는 '-' 없이 숫자만 입력해 주세요.",
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
            .string({ error: '담당자 휴대폰 번호를 입력해 주세요.' })
            .trim()
            .min(1, { error: '담당자 휴대폰 번호를 입력해 주세요.' })
            .pipe(
                z.string().regex(/^[0-9]+$/, {
                    error: "휴대폰 번호는 '-' 없이 숫자만 입력해 주세요.",
                }),
            ),
        email: z
            .string({ error: '이메일을 입력해 주세요.' })
            .trim()
            .min(1, { error: '이메일을 입력해 주세요.' })
            .pipe(z.email({ error: '올바른 이메일을 입력해 주세요.' })),
        website: z
            .string({ error: '브랜드 웹사이트를 입력해 주세요.' })
            .trim()
            .min(1, { error: '브랜드 웹사이트를 입력해 주세요.' })
            // z.url() 은 javascript:·data: 주소도 통과시키므로 http(s) 만 허용한다
            .pipe(
                z.url({
                    protocol: /^https?$/,
                    error: '올바른 웹사이트 주소를 입력해 주세요.',
                }),
            ),
        otherPlatforms: z
            .string({ error: '타사 입점현황을 다시 입력해 주세요.' })
            .trim(),
        content: z.string({ error: '문의 내용을 다시 입력해 주세요.' }).trim(),
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
