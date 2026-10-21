import assert from 'node:assert/strict';
import { test } from 'vitest';

import {
    INITIAL_ACTION_STATE,
    type ActionState,
} from '@/shared/types/action.types';

import { validVendorInquiry as validInput } from '../testing/validVendorInquiry';
import { submitVendorInquiry } from './vendorInquiry.actions';

async function submit(
    formData: FormData,
    previous: ActionState = INITIAL_ACTION_STATE,
) {
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
    assert.equal(result.success, false);
    assert.ok(result.message);
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
        assert.ok(result.errors?.[name], `${name} 오류가 필요합니다.`);
    }
});

test('필드 오류는 팀 공통 형태대로 필드마다 메시지 1개(문자열)다', async () => {
    const result = await submit(
        toFormData({ ...validInput, email: 'invalid' }),
    );
    assert.equal(typeof result.errors?.email, 'string');
});

test('정상 제출은 저장 완료로 오인하지 않는 검증 결과를 반환한다', async () => {
    const result = await submit(toFormData());
    assert.equal(result.success, true);
    assert.equal(result.errors, undefined);
    assert.match(result.message ?? '', /검증.*완료/);
    assert.match(result.message ?? '', /저장되지 않았/);
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

    assert.equal(result.success, false);
    for (const name of ['email', 'phoneNumber', 'secondaryCategory'] as const) {
        assert.ok(result.errors?.[name]);
    }
});

test('문자열 필드로 전달된 파일을 문자열로 강제 변환하지 않는다', async () => {
    const formData = toFormData();
    formData.set('email', new File(['invalid'], 'email.txt'));
    const result = await submit(formData);
    assert.equal(result.success, false);
    assert.ok(result.errors?.email);
});

test('수정 후 재제출이 이전 오류를 남기지 않는다', async () => {
    const invalid = await submit(
        toFormData({ ...validInput, email: 'invalid' }),
    );
    assert.equal(invalid.success, false);
    const valid = await submit(toFormData(), invalid);
    assert.equal(valid.success, true);
    assert.equal(valid.errors, undefined);
});
