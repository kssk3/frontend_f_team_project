import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';

import VendorInquiryForm from './VendorForm';

afterEach(cleanup);

const textValues = {
    회사명: '테스트 회사',
    브랜드명: '테스트 브랜드',
    담당자명: '홍길동',
    전화번호: '0212345678',
    '담당자 휴대폰 번호': '01012345678',
    '브랜드 웹사이트': 'https://example.com',
};

function select(label: string) {
    return screen.getByLabelText<HTMLSelectElement>(label);
}

async function fillFormWithEmail(email: string) {
    const user = userEvent.setup();
    render(<VendorInquiryForm />);

    for (const [label, value] of Object.entries(textValues)) {
        await user.type(screen.getByLabelText(label), value);
    }
    await user.type(screen.getByLabelText('담당자 이메일'), email);
    await user.selectOptions(select('문의 유형'), 'vendor');
    await user.selectOptions(select('대표 카테고리'), 'women');
    await user.selectOptions(select('2차 카테고리'), 'clothing');

    return user;
}

test('검증 실패 후에도 선택한 문의 유형과 카테고리가 화면에 유지된다', async () => {
    const user = await fillFormWithEmail('invalid-email');

    await user.click(screen.getByRole('button', { name: '등록' }));
    await screen.findByText('올바른 이메일을 입력해주세요.');

    expect(select('문의 유형').value).toBe('vendor');
    expect(select('대표 카테고리').value).toBe('women');
    expect(select('2차 카테고리').value).toBe('clothing');
});

test('검증이 완료된 뒤에도 선택한 카테고리가 화면에 유지된다', async () => {
    const user = await fillFormWithEmail('vendor@example.com');
    // 각 select의 첫 옵션이 아닌 값을 골라, 리셋으로 첫 옵션이 잡혀도 드러나게 한다
    await user.selectOptions(select('대표 카테고리'), 'men');
    await user.selectOptions(select('2차 카테고리'), 'bags');

    await user.click(screen.getByRole('button', { name: '등록' }));
    await screen.findByText(/검증이 완료/);

    expect(select('대표 카테고리').value).toBe('men');
    expect(select('2차 카테고리').value).toBe('bags');
});
