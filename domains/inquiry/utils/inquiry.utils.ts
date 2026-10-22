// 'zod' 이용한 검증
import { z } from 'zod';

import type { Inquiry, InquiryRow } from '../types/inquiry.types';

export const INQUIRY_MAX_LENGTH = 1000; // 문의 글자 수 제한

const FORBIDDEN_CHARS = /[\\/:<>|]/; // 파일명 사용 불가능한 문자

// 입력 규칙 - zod4 문법(팀 입점 문의 폼 domains/vendor/validation.ts 참고)
export const inquirySchema = z.object({
    productId: z.uuid({ error: '상품 정보가 올바르지 않습니다. '}),
    content: z
        .string()
        .trim()
        .min(1, { error: '문의 내용을 입력해주세요.' })
        .max(INQUIRY_MAX_LENGTH, {
            error: `문의 내용은 ${INQUIRY_MAX_LENGTH}자 이하로 입력해주세요.`,
        })
        .refine((value) => !FORBIDDEN_CHARS.test(value), {
            error: '문의 내용에 사용할 수 없는 문자(\\ / : < >)가 포함되어 있습니다.',
        }),
    notify: z.boolean(),
    isPublic: z.boolean(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// FormData 검증
export function validateInquiryInput(formData: FormData):
    | { values: InquiryInput; errors: Record<string, never>}
    | { values: null; errors: Record<string, string>} {
        const result = inquirySchema.safeParse({
            productId: String(formData.get('productId') ?? ''),
            content: String(formData.get('content') ?? ''),
            notify: formData.get('notify') === 'on',
            isPublic: formData.get('isPublic') === 'true',
        });
        if (result.success) {
            return { values: result.data, errors: {} };
        }

        // zod의 issues를 칸별 첫 메시지 하나로 변환
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
            const key = String(issue.path[0] ?? 'form');
            errors[key] ??= issue.message;
        }
        return { values: null, errors };
    }

// 뷰 응답 > 화면 타입
export function toInquiry(row: InquiryRow): Inquiry {
    return {
        id: row.id,
        isPublic: row.is_public,
        createdAt: row.created_at,
        isAnswered: row.is_answered,
        writer: row.writer,
        content: row.content,
        answer: row.answer,
    };
}

// DB UTC 한국시간과 일치시키기
const KST_DATE = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

// 날짜 형식 변환
export function formatDate(iso: string): string {
    return KST_DATE.format(new Date(iso)).replaceAll('/', '.');
}