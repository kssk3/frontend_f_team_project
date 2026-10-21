import assert from 'node:assert/strict';
import { test } from 'vitest';

import { validVendorInquiry as validInput } from '../testing/validVendorInquiry';
import type { VendorFormState } from '../types/types';
import { submitVendorInquiry } from './vendorInquiry.actions';

const initialState: VendorFormState = {
    status: 'idle',
    message: '',
    fieldErrors: {},
};

async function submit(formData: FormData, previous = initialState) {
    return submitVendorInquiry(previous, formData);
}

function toFormData(values = validInput) {
    const formData = new FormData();
    for (const [name, value] of Object.entries(values)) {
        formData.set(name, value);
    }
    return formData;
}

test('빈 제출에는 필수 필드별 오류를 반환한다', async () => {
    const result = await submit(new FormData());
    assert.equal(result.status, 'invalid');
    assert.ok(result.message.length > 0);
    const errors: Partial<Record<string, string[]>> = result.fieldErrors;
    for (const name of [
        'companyName',
        'brandName',
        'contactName',
        'phoneNumber',
        'inquiryType',
        'primaryCategory',
        'secondaryCategory',
        'mobileNumber',
        'email',
        'website',
    ] as const) {
        assert.ok(errors[name]?.length, `${name} 오류가 필요합니다.`);
    }
});

test('정상 제출은 저장 완료로 오인하지 않는 검증 결과를 반환한다', async () => {
    const result = await submit(toFormData());
    assert.equal(result.status, 'validated');
    assert.deepEqual(result.fieldErrors, {});
    assert.match(result.message, /검증.*완료/);
    assert.match(result.message, /저장되지 않았/);
});

test('잘못된 이메일·전화번호·카테고리에 해당 필드 오류를 반환한다', async () => {
    const result = await submit(
        toFormData({
            ...validInput,
            email: '잘못된 이메일',
            phoneNumber: '02-1234-5678',
            secondaryCategory: 'kitchen',
        }),
    );

    assert.equal(result.status, 'invalid');
    for (const name of ['email', 'phoneNumber', 'secondaryCategory'] as const) {
        assert.ok(result.fieldErrors[name]?.length);
    }
});

test('문자열 필드로 전달된 파일을 문자열로 강제 변환하지 않는다', async () => {
    const formData = toFormData();
    formData.set('email', new File(['invalid'], 'email.txt'));
    const result = await submit(formData);
    assert.equal(result.status, 'invalid');
    assert.ok(result.fieldErrors.email?.length);
});

test('검증 실패 후 수정할 수 있도록 제출한 문자열 값을 보존한다', async () => {
    const values = {
        ...validInput,
        companyName: '  테스트 회사  ',
        email: 'invalid',
    };
    const result = await submit(toFormData(values));
    assert.equal(result.status, 'invalid');
    assert.ok('values' in result);
    assert.deepEqual(result.values, values);
});

test('수정 후 재제출이 이전 오류를 남기지 않는다', async () => {
    const invalid = await submit(
        toFormData({ ...validInput, email: 'invalid' }),
    );
    assert.equal(invalid.status, 'invalid');
    const valid = await submit(toFormData(), invalid);
    assert.equal(valid.status, 'validated');
    assert.deepEqual(valid.fieldErrors, {});
});
