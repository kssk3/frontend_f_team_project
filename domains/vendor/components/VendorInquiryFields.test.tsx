import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { vendorFields } from '../types/vendorFields';
import { VENDOR_TEXT_MAX_LENGTH } from '../utils/vendorValidation';
import VendorInquiryFields from './VendorInquiryFields';

afterEach(cleanup);

test('입력칸마다 서버 검증과 같은 최대 글자 수를 둔다', () => {
    render(<VendorInquiryFields />);

    for (const [name, limit] of Object.entries(VENDOR_TEXT_MAX_LENGTH)) {
        const field = vendorFields.find((item) => item.name === name);
        const control = screen.getByLabelText(field?.label ?? name);
        expect(control.getAttribute('maxLength'), name).toBe(String(limit));
    }
});

test('JS 로드 전 제출이 실패해 돌려받은 값으로 입력칸과 선택값을 모두 다시 채운다', () => {
    render(
        <form>
            <VendorInquiryFields
                initialValues={{
                    companyName: '테스트 회사',
                    inquiryType: 'vendor',
                    primaryCategory: 'men',
                    secondaryCategory: 'bags',
                    content: '입점 문의입니다.',
                }}
            />
        </form>,
    );

    expect(screen.getByLabelText<HTMLInputElement>('회사명').value).toBe(
        '테스트 회사',
    );
    expect(screen.getByLabelText<HTMLTextAreaElement>('문의 내용').value).toBe(
        '입점 문의입니다.',
    );
    expect(screen.getByLabelText<HTMLSelectElement>('문의 유형').value).toBe(
        'vendor',
    );
    expect(
        screen.getByLabelText<HTMLSelectElement>('대표 카테고리').value,
    ).toBe('men');
    expect(screen.getByLabelText<HTMLSelectElement>('2차 카테고리').value).toBe(
        'bags',
    );
});
