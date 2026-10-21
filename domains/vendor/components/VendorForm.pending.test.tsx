import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import { submitVendorInquiry } from '../actions/actions';
import type { VendorFormState } from '../types/types';
import VendorInquiryForm from './VendorForm';

vi.mock('../actions/actions', () => ({ submitVendorInquiry: vi.fn() }));
afterEach(cleanup);

test('제출 중에는 등록 버튼이 비활성화되고 끝나면 다시 활성화된다', async () => {
    let finish!: (state: VendorFormState) => void;

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
        finish({
            status: 'invalid',
            message: '입력 내용을 확인해 주세요',
            fieldErrors: {},
        }),
    );

    expect(await screen.findByRole('button', { name: '등록' })).toHaveProperty(
        'disabled',
        false,
    );
});
