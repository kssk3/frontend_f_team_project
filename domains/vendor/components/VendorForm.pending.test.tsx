import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { submitVendorInquiry } from '../actions/vendorInquiry.actions';
import type { VendorInquiryState } from '../types/types';
import VendorInquiryForm from './VendorForm';

vi.mock('../actions/vendorInquiry.actions', () => ({
    submitVendorInquiry: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
afterEach(cleanup);

test('제출 중에는 등록 버튼이 비활성화되고 끝나면 다시 활성화된다', async () => {
    let finish!: (state: VendorInquiryState) => void;

    vi.mocked(submitVendorInquiry).mockImplementation(
        () => new Promise((resolve) => (finish = resolve)),
    );

    const user = userEvent.setup();
    render(<VendorInquiryForm />);

    await user.click(screen.getByRole('button', { name: '등록' }));

    const pendingButton = await screen.findByRole('button', {
        name: '검증 중...',
    });

    expect(pendingButton).toHaveProperty('disabled', true);

    await act(async () =>
        finish({ success: false, message: '입력 내용을 확인해 주세요.' }),
    );

    expect(await screen.findByRole('button', { name: '등록' })).toHaveProperty(
        'disabled',
        false,
    );
});
