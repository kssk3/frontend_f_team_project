import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import LoginPage from './page';
const boundary = vi.hoisted(() => ({
    signIn: vi.fn(),
    profile: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    redirect: '/cart?from=login#items',
}));
vi.mock('@/domains/auth/actions', () => ({ login: vi.fn() }));
vi.mock('next/navigation', () => ({
    useRouter: () => boundary,
    useSearchParams: () =>
        new URLSearchParams({ redirectUrl: boundary.redirect }),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/shared/lib/supabase', () => ({
    createServerClient: () => ({
        auth: { signInWithPassword: boundary.signIn, signOut: vi.fn() },
        from: () => ({
            select: () => ({ eq: () => ({ maybeSingle: boundary.profile }) }),
        }),
    }),
}));
beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    boundary.redirect = '/cart?from=login#items';
    boundary.signIn.mockResolvedValue({
        data: { user: { id: 'member' }, session: {} },
        error: null,
    });
    boundary.profile.mockResolvedValue({
        data: { id: 'member', deleted_at: null },
        error: null,
    });
});
afterEach(cleanup);
async function submit() {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(
        screen.getByRole('textbox', { name: '이메일' }),
        'member@example.com',
    );
    await user.type(screen.getByLabelText('비밀번호'), ' secret pass ');
    await user.click(screen.getByRole('button', { name: /통합 회원 로그인/ }));
}
test('actual login page submits to Supabase and refreshes the internal destination', async () => {
    await submit();
    await waitFor(() =>
        expect(boundary.signIn).toHaveBeenCalledWith({
            email: 'member@example.com',
            password: ' secret pass ',
        }),
    );
    await waitFor(() =>
        expect(boundary.replace).toHaveBeenCalledWith('/cart?from=login#items'),
    );
    expect(boundary.refresh).toHaveBeenCalled();
    expect(localStorage.getItem('savedLoginEmail')).toBe('member@example.com');
    expect(screen.getByText('최대 20% 할인쿠폰')).toBeTruthy();
});
test('actual page displays failed credentials without navigation', async () => {
    boundary.signIn.mockResolvedValue({
        data: { user: null, session: null },
        error: { code: 'invalid_credentials' },
    });
    await submit();
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(boundary.replace).not.toHaveBeenCalled();
});
test('successful login rejects an external redirect', async () => {
    boundary.redirect = '//evil.test';
    await submit();
    await waitFor(() => expect(boundary.replace).toHaveBeenCalledWith('/'));
});
test('pending authentication disables repeated submit', async () => {
    let resolve!: (value: unknown) => void;
    boundary.signIn.mockImplementation(
        () =>
            new Promise((done) => {
                resolve = done;
            }),
    );
    await submit();
    expect(
        screen.getByRole<HTMLButtonElement>('button', { name: '로그인 중...' })
            .disabled,
    ).toBe(true);
    resolve({
        data: { user: null, session: null },
        error: { code: 'invalid_credentials' },
    });
    await screen.findByRole('alert');
});
