import { beforeEach, expect, test, vi } from 'vitest';
import { getCurrentUser, isLoggedIn } from './dal';
const sdk = vi.hoisted(() => ({
    create: vi.fn(),
    user: vi.fn(),
    profile: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('@/shared/lib/supabase', () => ({ createServerClient: sdk.create }));
vi.mock('./lib/session', () => ({
    getSession: async () => ({ userId: 'legacy' }),
}));
beforeEach(() => {
    vi.resetAllMocks();
    sdk.create.mockReturnValue({
        auth: { getUser: sdk.user },
        from: () => ({
            select: () => ({ eq: () => ({ maybeSingle: sdk.profile }) }),
        }),
    });
    sdk.user.mockResolvedValue({
        data: { user: { id: 'member', email: 'member@example.com' } },
        error: null,
    });
    sdk.profile.mockResolvedValue({
        data: { id: 'member', name: 'Member', deleted_at: null },
        error: null,
    });
});
test('returns only the verified matching active identity', async () => {
    expect(await getCurrentUser()).toEqual({
        id: 'member',
        name: 'Member',
        email: 'member@example.com',
    });
    expect(await isLoggedIn()).toBe(true);
});
test.each([
    [null, null],
    [{ id: 'member' }, { id: 'member', deleted_at: '2026-01-01' }],
    [{ id: 'member' }, null],
    [{ id: 'member' }, { id: 'other', deleted_at: null }],
])(
    'rejects incomplete identities despite a residual legacy session',
    async (user, profile) => {
        sdk.user.mockResolvedValue({ data: { user }, error: null });
        sdk.profile.mockResolvedValue({ data: profile, error: null });
        expect(await getCurrentUser()).toBeNull();
        expect(await isLoggedIn()).toBe(false);
    },
);
test('query and configuration failures do not authorize public UI', async () => {
    sdk.profile.mockResolvedValue({
        data: { id: 'member' },
        error: { code: '42501' },
    });
    expect(await isLoggedIn()).toBe(false);
    sdk.create.mockImplementation(() => {
        throw new Error('config');
    });
    expect(await getCurrentUser()).toBeNull();
});
