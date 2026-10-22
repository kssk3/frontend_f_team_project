import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { confirmCancel } from '../testing/confirmCancel';
import VendorInquiryForm from './VendorForm';

// 정해진 주소가 있을 때의 동작 (실제 값은 아직 비어 있음)
vi.mock('../data/vendorInquiryLinks', () => ({
    PRIVACY_POLICY_URL: '/policy/privacy',
    CANCEL_REDIRECT_PATH: '/help/faq',
}));
vi.mock('../actions/vendorInquiry.actions', () => ({
    submitVendorInquiry: vi.fn(),
}));
const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

afterEach(cleanup);

test('개인정보처리방침 주소가 정해지면 새 창 링크로 보여준다', () => {
    render(<VendorInquiryForm />);
    const link = screen.getByRole('link', { name: 'EQL 개인정보처리방침' });
    expect(link.getAttribute('href')).toBe('/policy/privacy');
    expect(link.getAttribute('target')).toBe('_blank');
});

test('취소 후 이동 주소가 정해지면 그 주소로 이동한다', async () => {
    const user = userEvent.setup();
    render(<VendorInquiryForm />);

    await confirmCancel(user);

    await vi.waitFor(() =>
        expect(router.push).toHaveBeenCalledWith('/help/faq'),
    );
});
