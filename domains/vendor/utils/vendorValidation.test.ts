import assert from 'node:assert/strict';
import { test } from 'vitest';

import { validVendorInquiry as validInput } from '../testing/validVendorInquiry';
import { vendorInquirySchema } from './vendorValidation';

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
