import assert from 'node:assert/strict';
import { test } from 'vitest';

import { formatDate, validateInquiryInput } from './inquiry.utils';

const PRODUCT = 'a0000000-0000-4000-8000-000000000001';
const form = (fields: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    return fd;
};

test('정상 입력 → errors 없음, 체크박스·라디오 변환', () => {
    const r = validateInquiryInput(
        form({
            productId: PRODUCT,
            content: ' 사이즈 문의합니다 ',
            notify: 'on',
            isPublic: 'false',
        }),
    );
    assert.equal(Object.keys(r.errors).length, 0);
    assert.deepEqual(r.values, {
        productId: PRODUCT,
        content: '사이즈 문의합니다',
        notify: true,
        isPublic: false,
    });
});

test('빈 내용 · 특수문자 · 1,001자 · 잘못된 상품 id', () => {
    assert.equal(
        validateInquiryInput(
            form({ productId: PRODUCT, content: '   ', isPublic: 'true' }),
        ).errors.content,
        '문의 내용을 입력해주세요.',
    );
    assert.match(
        validateInquiryInput(
            form({ productId: PRODUCT, content: '<script>', isPublic: 'true' }),
        ).errors.content ?? '',
        /사용할 수 없는 문자/,
    );
    assert.match(
        validateInquiryInput(
            form({
                productId: PRODUCT,
                content: 'a'.repeat(1001),
                isPublic: 'true',
            }),
        ).errors.content ?? '',
        /1000자/,
    );
    assert.ok(
        validateInquiryInput(
            form({ productId: 'abc', content: 'ok', isPublic: 'true' }),
        ).errors.productId,
    );
});

test('체크박스 없음 → notify false', () => {
    const r = validateInquiryInput(
        form({ productId: PRODUCT, content: 'ok', isPublic: 'true' }),
    );
    assert.equal(r.values?.notify, false);
});

test('날짜 표기 — 서울 시간 기준', () => {
    assert.equal(formatDate('2026-08-28T01:02:03+00:00'), '2026-08-28');
});
