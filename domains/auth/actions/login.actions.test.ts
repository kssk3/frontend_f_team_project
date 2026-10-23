import { beforeEach, expect, test, vi } from 'vitest';
import { signInAction } from './login.actions';
const sdk = vi.hoisted(() => ({
    create: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    profile: vi.fn(),
    revalidate: vi.fn(),
}));
vi.mock('@/shared/lib/supabase', () => ({ createServerClient: sdk.create }));
vi.mock('next/cache', () => ({ revalidatePath: sdk.revalidate }));
beforeEach(() => {
    vi.resetAllMocks();
    sdk.create.mockReturnValue({
        auth: { signInWithPassword: sdk.signIn, signOut: sdk.signOut },
        from: () => ({
            select: () => ({ eq: () => ({ maybeSingle: sdk.profile }) }),
        }),
    });
    sdk.signIn.mockResolvedValue({
        data: { user: { id: 'member' }, session: {} },
        error: null,
    });
    sdk.profile.mockResolvedValue({
        data: { id: 'member', deleted_at: null },
        error: null,
    });
    sdk.signOut.mockResolvedValue({ error: null });
});
function form(
    email: string | Blob = ' member@example.com ',
    password: string | Blob = ' secret pass ',
) {
    const data = new FormData();
    data.set('email', email);
    data.set('password', password);
    return data;
}
test('trims email but preserves the submitted password', async () => {
    expect((await signInAction({ success: false }, form())).success).toBe(true);
    expect(sdk.signIn).toHaveBeenCalledWith({
        email: 'member@example.com',
        password: ' secret pass ',
    });
});
test.each([
    ['bad', 'password'],
    ['', 'password'],
    ['member@example.com', ''],
    [new Blob(['email']), 'password'],
    ['member@example.com', new Blob(['password'])],
])(
    'rejects malformed input before authentication: %s',
    async (email, password) => {
        const result = await signInAction(
            { success: false },
            form(email, password),
        );
        expect(result.success).toBe(false);
        expect(result.errors).toBeTruthy();
        expect(sdk.create).not.toHaveBeenCalled();
    },
);
test.each([
    [{ code: 'invalid_credentials' }, /이메일 또는 비밀번호/],
    [{ code: 'email_not_confirmed' }, /이메일 인증/],
    [{ code: 'unexpected_failure', status: 500 }, /인증 서비스/],
])(
    'reports usable auth failure without internal details',
    async (error, message) => {
        sdk.signIn.mockResolvedValue({
            data: { user: null, session: null },
            error: { ...error, message: 'internal detail' },
        });
        const result = await signInAction({ success: false }, form());
        expect(result.success).toBe(false);
        expect(result.message).toMatch(message);
        expect(result.message).not.toContain('internal detail');
    },
);
test.each([
    [null, null, /프로필이 존재하지/],
    [{ id: 'member', deleted_at: '2026-01-01' }, null, /탈퇴한/],
    [null, { code: '42501' }, /회원 정보.*확인/],
    [{ id: 'other', deleted_at: null }, null, /회원 정보.*확인/],
])(
    'revokes login when the matching active profile cannot be used',
    async (data, error, message) => {
        sdk.profile.mockResolvedValue({ data, error });
        const result = await signInAction({ success: false }, form());
        expect(result.success).toBe(false);
        expect(result.message).toMatch(message);
        expect(sdk.signOut).toHaveBeenCalledWith({ scope: 'local' });
        expect(sdk.revalidate).not.toHaveBeenCalled();
    },
);
test('handles configuration and network failure without throwing', async () => {
    sdk.create.mockImplementation(() => {
        throw new Error('secret internal config');
    });
    const result = await signInAction({ success: false }, form());
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/설정|서비스/);
    expect(result.message).not.toContain('secret');
});
test('revokes a newly created session when profile lookup throws', async () => {
    sdk.profile.mockRejectedValue(new Error('network'));
    expect((await signInAction({ success: false }, form())).success).toBe(
        false,
    );
    expect(sdk.signOut).toHaveBeenCalledWith({ scope: 'local' });
});
const cookieBoundary = vi.hoisted(() => ({ deleted: vi.fn() }));
vi.mock('next/headers', () => ({
    cookies: async () => ({
        getAll: () => [{ name: 'sb-project-auth-token' }, { name: 'session' }],
        delete: cookieBoundary.deleted,
    }),
}));
test('removes new login cookies even when signOut fails for a rejected profile', async () => {
    sdk.profile.mockResolvedValue({ data: null, error: null });
    sdk.signOut.mockRejectedValue(new Error('offline'));
    expect((await signInAction({ success: false }, form())).success).toBe(
        false,
    );
    expect(cookieBoundary.deleted).toHaveBeenCalledWith(
        'sb-project-auth-token',
    );
});
