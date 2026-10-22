import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import AuthMenu from '@/app/_component/AuthMenu';
import AuthSignupToast from './AuthSignupToast';
const sdk = vi.hoisted(() => ({ user: vi.fn(), profile: vi.fn() }));
vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/shared/lib/supabase', () => ({
    createServerClient: () => ({
        auth: { getUser: sdk.user },
        from: () => ({
            select: () => ({ eq: () => ({ maybeSingle: sdk.profile }) }),
        }),
    }),
}));
afterEach(cleanup);
test.each([true, false])(
    'header and main reflect the same active profile: %s',
    async (active) => {
        sdk.user.mockResolvedValue({
            data: { user: { id: 'member' } },
            error: null,
        });
        sdk.profile.mockResolvedValue({
            data: {
                id: 'member',
                name: 'Member',
                deleted_at: active ? null : '2026-01-01',
            },
            error: null,
        });
        render(
            <>
                <ul>
                    {await AuthMenu({
                        loginItem: (
                            <li>
                                <a href="/login">로그인</a>
                            </li>
                        ),
                    })}
                </ul>
                {await AuthSignupToast()}
            </>,
        );
        if (active) {
            expect(
                screen.getByRole('button', { name: '로그아웃' }),
            ).toBeTruthy();
            expect(screen.queryByLabelText('신규 회원 혜택')).toBeNull();
        } else {
            expect(screen.getByRole('link', { name: '로그인' })).toBeTruthy();
            expect(screen.getByLabelText('신규 회원 혜택')).toBeTruthy();
        }
    },
);
