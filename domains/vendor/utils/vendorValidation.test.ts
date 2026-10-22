import assert from 'node:assert/strict';
import { test } from 'vitest';

import { validVendorInquiry as validInput } from '../testing/validVendorInquiry';
import {
    VENDOR_TEXT_MAX_LENGTH,
    vendorInquirySchema,
} from './vendorValidation';

test('12개 필드를 정규화하고 전화번호의 앞자리 0을 보존한다', () => {
    const result = vendorInquirySchema.parse({
        ...validInput,
        companyName: '  테스트 회사  ',
        mobileNumber: '  01012345678  ',
        website: '  https://example.com  ',
        otherPlatforms: '  다른 몰  ',
        content: '  입점 문의입니다.  ',
    });

    assert.deepEqual(result, {
        ...validInput,
        otherPlatforms: '다른 몰',
        content: '입점 문의입니다.',
    });
});

for (const [name, value] of [
    ['mobileNumber', ''],
    ['mobileNumber', '010-1234-5678'],
    ['website', ''],
    ['website', '올바르지 않은 주소'],
    // 관리자 화면에서 링크로 열릴 수 있으므로 http(s) 주소만 받는다
    ['website', 'javascript:alert(1)'],
    ['website', 'data:text/html,hi'],
    ['website', 'ftp://example.com'],
    // DB 와 같은 모양(https://호스트[/경로])만 받는다
    ['website', 'https:///example.com'],
    ['website', 'https://example.com/a b'],
] as const) {
    test(`${name}의 잘못된 값 ${JSON.stringify(value)}를 거부한다`, () => {
        const result = vendorInquirySchema.safeParse({
            ...validInput,
            [name]: value,
        });

        assert.equal(result.success, false);
        if (!result.success) {
            assert.ok(
                result.error.issues.some((issue) => issue.path[0] === name),
            );
        }
    });
}

test('선택 입력란은 빈 문자열을 허용하고 문자열이 아닌 값은 거부한다', () => {
    assert.equal(vendorInquirySchema.safeParse(validInput).success, true);
    for (const name of ['otherPlatforms', 'content']) {
        const result = vendorInquirySchema.safeParse({
            ...validInput,
            [name]: null,
        });
        assert.equal(result.success, false);
    }
});

test('대표 카테고리에 속하지 않는 2차 카테고리를 거부한다', () => {
    const result = vendorInquirySchema.safeParse({
        ...validInput,
        secondaryCategory: 'kitchen',
    });
    assert.equal(result.success, false);
    if (!result.success) {
        assert.ok(
            result.error.issues.some(
                (issue) => issue.path[0] === 'secondaryCategory',
            ),
        );
    }
    assert.equal(
        vendorInquirySchema.safeParse({
            ...validInput,
            primaryCategory: 'life',
            secondaryCategory: 'kitchen',
        }).success,
        true,
    );
});

for (const [name, message] of [
    ['companyName', '회사명을 입력해 주세요.'],
    ['brandName', '브랜드명을 입력해 주세요.'],
    ['contactName', '담당자명을 입력해 주세요.'],
] as const) {
    test(`${name}이 빈칸이면 길이 오류가 아니라 "${message}"를 보여준다`, () => {
        const result = vendorInquirySchema.safeParse({
            ...validInput,
            [name]: '   ',
        });

        assert.equal(result.success, false);
        if (!result.success) {
            const issue = result.error.issues.find(
                (issue) => issue.path[0] === name,
            );
            assert.equal(issue?.message, message);
        }
    });
}

test('이름 칸이 비어 있어도 2차 카테고리 불일치 오류를 함께 알려준다', () => {
    const result = vendorInquirySchema.safeParse({
        ...validInput,
        companyName: '',
        secondaryCategory: 'kitchen',
    });

    assert.equal(result.success, false);
    if (!result.success) {
        assert.ok(
            result.error.issues.some(
                (issue) => issue.path[0] === 'secondaryCategory',
            ),
        );
    }
});

test('모든 오류 문구는 EQL 표기처럼 "~해 주세요."로 띄어 쓰고 마침표로 끝난다', () => {
    const cases = [
        {},
        Object.fromEntries(Object.keys(validInput).map((key) => [key, ''])),
        {
            ...validInput,
            companyName: 'a',
            brandName: 'b'.repeat(51),
            phoneNumber: '02-12',
            mobileNumber: '010-1',
            email: 'x',
            website: 'x',
            secondaryCategory: 'kitchen',
        },
    ];
    const messages = cases.flatMap((input) => {
        const result = vendorInquirySchema.safeParse(input);
        return result.success ? [] : result.error.issues.map((i) => i.message);
    });

    assert.ok(messages.length > 10);
    for (const message of messages) {
        assert.doesNotMatch(message, /해주세요/, message);
        assert.match(message, /\.$/, message);
    }
});

// 칸 형식에 맞으면서 정확히 length 자인 값
const EMAIL_DOMAIN = '@example.com';
const WEBSITE_PREFIX = 'https://example.com/';
const valueOfLength: Record<
    keyof typeof VENDOR_TEXT_MAX_LENGTH,
    (length: number) => string
> = {
    companyName: (length) => '가'.repeat(length),
    brandName: (length) => '가'.repeat(length),
    contactName: (length) => '가'.repeat(length),
    phoneNumber: (length) => '0'.repeat(length),
    mobileNumber: (length) => '0'.repeat(length),
    email: (length) => 'a'.repeat(length - EMAIL_DOMAIN.length) + EMAIL_DOMAIN,
    website: (length) =>
        WEBSITE_PREFIX + 'a'.repeat(length - WEBSITE_PREFIX.length),
    otherPlatforms: (length) => '가'.repeat(length),
    content: (length) => '가'.repeat(length),
};

// DB 제약(db/migrations)과 같은 상한이어야 정상 입력이 DB 에서 거부되지 않는다
for (const [name, limit] of Object.entries(VENDOR_TEXT_MAX_LENGTH)) {
    const makeValue = valueOfLength[name as keyof typeof valueOfLength];

    test(`${name} 은 ${limit}자까지 허용하고 넘으면 거부한다`, () => {
        const ok = vendorInquirySchema.safeParse({
            ...validInput,
            [name]: makeValue(limit),
        });
        const over = vendorInquirySchema.safeParse({
            ...validInput,
            [name]: makeValue(limit + 1),
        });
        assert.equal(ok.success, true, JSON.stringify(ok.error?.issues));
        assert.equal(over.success, false);
        assert.ok(over.error?.issues.some((issue) => issue.path[0] === name));
    });
}

test('DB 와 같은 상한을 쓴다', () => {
    assert.deepEqual(VENDOR_TEXT_MAX_LENGTH, {
        companyName: 50,
        brandName: 50,
        contactName: 20,
        phoneNumber: 20,
        mobileNumber: 20,
        email: 254,
        website: 2048,
        otherPlatforms: 2000,
        content: 5000,
    });
});
