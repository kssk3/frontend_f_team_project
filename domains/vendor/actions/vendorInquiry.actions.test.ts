import assert from 'node:assert/strict';
import { beforeEach, test, vi } from 'vitest';

import { validVendorInquiry as validInput } from '../testing/validVendorInquiry';
import {
    INITIAL_VENDOR_INQUIRY_STATE,
    type VendorInquiryState,
} from '../types/types';
import { submitVendorInquiry } from './vendorInquiry.actions';

// 실제 DB 대신 insert 호출만 기록하는 가짜 Supabase 클라이언트
const db = vi.hoisted(() => ({
    from: vi.fn(),
    insert: vi.fn(),
}));
vi.mock('@/shared/lib/supabase', () => ({
    createServerClient: () => ({ from: db.from }),
}));

beforeEach(() => {
    db.from.mockReset().mockReturnValue({ insert: db.insert });
    db.insert.mockReset().mockResolvedValue({ error: null });
});

async function submit(
    formData: FormData,
    previous: VendorInquiryState = INITIAL_VENDOR_INQUIRY_STATE,
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

test('검증 실패 시 JS 로드 전 제출에서도 입력값을 되살릴 수 있게 제출한 문자열을 돌려준다', async () => {
    const values = {
        ...validInput,
        companyName: '  테스트 회사  ',
        email: 'invalid',
    };
    const result = await submit(toFormData(values));

    assert.equal(result.success, false);
    assert.deepEqual(result.data?.values, values);
});

test('문자열이 아닌 값은 되살릴 입력값에서 빈 문자열로 바꾼다', async () => {
    const formData = toFormData();
    formData.set('email', new File(['invalid'], 'email.txt'));
    const result = await submit(formData);

    assert.equal(result.success, false);
    assert.equal(result.data?.values?.email, '');
});

test('검증에 실패하면 DB에 저장하지 않는다', async () => {
    await submit(toFormData({ ...validInput, email: 'invalid' }));
    assert.equal(db.insert.mock.calls.length, 0);
});

test('검증에 통과하면 정규화된 값을 vendor_inquiries 테이블에 한 번 저장한다', async () => {
    const result = await submit(
        toFormData({
            ...validInput,
            companyName: '  테스트 회사  ',
            otherPlatforms: '  다른 몰  ',
        }),
    );

    assert.equal(result.success, true);
    assert.deepEqual(db.from.mock.calls, [['vendor_inquiries']]);
    assert.deepEqual(db.insert.mock.calls, [
        [
            {
                company_name: '테스트 회사',
                brand_name: '테스트 브랜드',
                contact_name: '홍길동',
                phone: '0212345678',
                inquiry_type: 'vendor',
                primary_category: 'women',
                secondary_category: 'clothing',
                mobile: '01012345678',
                email: 'vendor@example.com',
                website: 'https://example.com',
                other_platforms: '다른 몰',
                content: '',
            },
        ],
    ]);
});

test('저장에 성공하면 등록 완료 메시지와 새 접수 표시를 돌려준다', async () => {
    const first = await submit(toFormData());
    const second = await submit(toFormData(), first);

    assert.equal(first.success, true);
    assert.equal(first.errors, undefined);
    assert.equal(first.message, '정상적으로 문의가 등록되었습니다.');
    assert.ok(first.data?.submissionKey);
    assert.notEqual(first.data?.submissionKey, second.data?.submissionKey);
});

test('DB 저장에 실패하면 내부 오류를 숨기고 입력값을 유지한다', async () => {
    db.insert.mockResolvedValue({
        error: { code: 'PGRST205', message: 'secret internal detail' },
    });
    const result = await submit(toFormData());

    assert.equal(result.success, false);
    assert.ok(result.message);
    assert.doesNotMatch(result.message ?? '', /secret internal detail/);
    assert.equal(result.data?.values?.companyName, validInput.companyName);
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
