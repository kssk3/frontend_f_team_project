import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { confirmCancel } from '../testing/confirmCancel';
import { VENDOR_TEXT_MAX_LENGTH } from '../utils/vendorValidation';
import VendorInquiryForm from './VendorForm';

// 실제 DB 대신 insert 결과만 흉내내는 가짜 Supabase 클라이언트
const db = vi.hoisted(() => ({ insert: vi.fn() }));
vi.mock('@/shared/lib/supabase', () => ({
    createServerClient: () => ({ from: () => ({ insert: db.insert }) }),
}));

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

beforeEach(() => {
    db.insert.mockReset().mockResolvedValue({ error: null });
    router.push.mockReset();
});
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

function field(label: string) {
    return screen.getByLabelText<HTMLInputElement | HTMLTextAreaElement>(label);
}

async function fill(user: UserEvent, label: string, value: string) {
    await user.click(field(label));
    await user.paste(value);
}

async function fillFormWithEmail(email: string) {
    const user = userEvent.setup();
    render(<VendorInquiryForm />);

    for (const [label, value] of Object.entries({
        ...textValues,
        '담당자 이메일': email,
    })) {
        await fill(user, label, value);
    }
    await user.selectOptions(select('문의 유형'), 'vendor');
    await user.selectOptions(select('대표 카테고리'), 'women');
    await user.selectOptions(select('2차 카테고리'), 'clothing');

    return user;
}

test('검증 실패 후에도 선택한 문의 유형과 카테고리가 화면에 유지된다', async () => {
    const user = await fillFormWithEmail('invalid-email');

    await user.click(screen.getByRole('button', { name: '등록' }));
    await screen.findByText('올바른 이메일을 입력해 주세요.');

    expect(select('문의 유형').value).toBe('vendor');
    expect(select('대표 카테고리').value).toBe('women');
    expect(select('2차 카테고리').value).toBe('clothing');
});

test('검증 실패 후에도 입력한 값이 화면에 그대로 남는다', async () => {
    const user = await fillFormWithEmail('invalid-email');
    await fill(user, '문의 내용', '입점 문의입니다.');

    await user.click(screen.getByRole('button', { name: '등록' }));
    await screen.findByText('올바른 이메일을 입력해 주세요.');

    expect(field('회사명').value).toBe('테스트 회사');
    expect(field('담당자 이메일').value).toBe('invalid-email');
    expect(field('문의 내용').value).toBe('입점 문의입니다.');
});

test('등록에 성공하면 "정상적으로 문의가 등록되었습니다." 모달이 열린다', async () => {
    const user = await fillFormWithEmail('vendor@example.com');

    await user.click(screen.getByRole('button', { name: '등록' }));

    const dialog = await screen.findByRole('dialog');
    expect(
        within(dialog).getByText('정상적으로 문의가 등록되었습니다.'),
    ).toBeTruthy();
});

test('등록에 성공하면 입력칸과 선택값이 모두 비워진다', async () => {
    const user = await fillFormWithEmail('vendor@example.com');
    await fill(user, '문의 내용', '입점 문의입니다.');

    await user.click(screen.getByRole('button', { name: '등록' }));
    await screen.findByRole('dialog');

    for (const label of [
        ...Object.keys(textValues),
        '담당자 이메일',
        '문의 내용',
    ]) {
        expect(field(label).value, `${label} 이 비워져야 합니다.`).toBe('');
    }
    expect(select('문의 유형').value).toBe('');
    expect(select('대표 카테고리').value).toBe('');
    expect(select('2차 카테고리').value).toBe('');
});

test('완료 모달의 확인을 누르면 모달이 닫힌다', async () => {
    const user = await fillFormWithEmail('vendor@example.com');
    await user.click(screen.getByRole('button', { name: '등록' }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: '확인' }));

    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('DB 저장에 실패하면 입력값을 유지하고 다시 시도 안내를 보여준다', async () => {
    db.insert.mockResolvedValue({ error: { code: 'PGRST205' } });
    const user = await fillFormWithEmail('vendor@example.com');

    await user.click(screen.getByRole('button', { name: '등록' }));

    expect(await screen.findByText(/잠시 후 다시 시도해 주세요/)).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(field('회사명').value).toBe('테스트 회사');
    expect(select('문의 유형').value).toBe('vendor');
});

test('취소를 누르면 EQL과 같은 확인 모달이 뜨고, 모달의 취소를 누르면 페이지에 머문다', async () => {
    const user = userEvent.setup();
    render(<VendorInquiryForm />);
    await fill(user, '회사명', '테스트 회사');

    await user.click(screen.getByRole('button', { name: '취소' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('입점 문의 취소')).toBeTruthy();
    expect(
        within(dialog).getByText(
            '입력된 내용은 저장되지 않습니다. 페이지를 벗어나시겠습니까?',
        ),
    ).toBeTruthy();

    await user.click(within(dialog).getByRole('button', { name: '취소' }));

    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(router.push).not.toHaveBeenCalled();
    expect(field('회사명').value).toBe('테스트 회사');
});

test('취소 확인 후 "취소되었습니다." 안내를 닫으면 페이지를 벗어난다', async () => {
    const user = userEvent.setup();
    render(<VendorInquiryForm />);

    await confirmCancel(user);

    await vi.waitFor(() => expect(router.push).toHaveBeenCalledTimes(1));
});

test('필수 입력칸은 보조기기에도 필수로 알리고, 선택 입력칸은 알리지 않는다', () => {
    render(<VendorInquiryForm />);
    const required = [
        ...Object.keys(textValues),
        '담당자 이메일',
        '문의 유형',
        '대표 카테고리',
        '2차 카테고리',
    ];
    for (const label of required) {
        expect(
            screen.getByLabelText(label).getAttribute('aria-required'),
            label,
        ).toBe('true');
    }
    for (const label of ['타사 입점현황', '문의 내용']) {
        expect(
            screen.getByLabelText(label).getAttribute('aria-required'),
            label,
        ).not.toBe('true');
    }
});

test('입력칸 글자 수 제한은 서버 검증 상한과 같다', () => {
    render(<VendorInquiryForm />);
    // 입력칸 id 는 필드 이름과 같다
    for (const [name, max] of Object.entries(VENDOR_TEXT_MAX_LENGTH)) {
        const input = document.getElementById(name) as HTMLInputElement;
        expect(input.maxLength, name).toBe(max);
    }
});

test('개인정보처리방침 주소가 정해지지 않았으면 링크 없이 문구만 보여준다', () => {
    render(<VendorInquiryForm />);
    expect(screen.getByText(/EQL 개인정보처리방침/)).toBeTruthy();
    expect(
        screen.queryByRole('link', { name: 'EQL 개인정보처리방침' }),
    ).toBeNull();
});
