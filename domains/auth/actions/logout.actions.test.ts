import { beforeEach, expect, test, vi } from 'vitest';
import { logoutAction } from './logout.actions';
const boundary = vi.hoisted(() => ({
    create: vi.fn(),
    signOut: vi.fn(),
    deleted: vi.fn(),
    revalidate: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('@/shared/lib/supabase', () => ({
    createServerClient: boundary.create,
}));
vi.mock('next/headers', () => ({
    cookies: async () => ({
        getAll: () => [
            { name: 'sb-project-auth-token' },
            { name: 'session' },
            { name: 'preference' },
        ],
        delete: boundary.deleted,
    }),
}));
vi.mock('next/cache', () => ({ revalidatePath: boundary.revalidate }));
beforeEach(() => {
    vi.resetAllMocks();
    boundary.create.mockReturnValue({ auth: { signOut: boundary.signOut } });
    boundary.signOut.mockResolvedValue({ error: null });
});
test.each(['success', 'missing', 'throw', 'config'])(
    'clears authentication locally and refreshes UI on %s',
    async (mode) => {
        if (mode === 'missing')
            boundary.signOut.mockResolvedValue({
                error: { name: 'AuthSessionMissingError' },
            });
        if (mode === 'throw')
            boundary.signOut.mockRejectedValue(new Error('internal'));
        if (mode === 'config')
            boundary.create.mockImplementation(() => {
                throw new Error('config');
            });
        expect((await logoutAction()).success).toBe(true);
        expect(boundary.deleted).toHaveBeenCalledWith('sb-project-auth-token');
        expect(boundary.deleted).toHaveBeenCalledWith('session');
        expect(boundary.deleted).not.toHaveBeenCalledWith('preference');
        expect(boundary.revalidate).toHaveBeenCalledWith('/', 'layout');
    },
);
