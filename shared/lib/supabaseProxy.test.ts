// @vitest-environment node
import { beforeEach, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { refreshSupabaseSession } from './supabaseProxy';
const boundary = vi.hoisted(() => ({
    create: vi.fn(),
    getUser: vi.fn(),
    cookies: undefined as
        | undefined
        | {
              getAll: () => { name: string; value: string }[];
              setAll: (
                  cookies: {
                      name: string;
                      value: string;
                      options: { path?: string; httpOnly?: boolean };
                  }[],
                  headers: Record<string, string>,
              ) => void;
          },
}));
vi.mock('@supabase/ssr', () => ({ createServerClient: boundary.create }));
beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'public-test-key');
    vi.clearAllMocks();
    boundary.create.mockImplementation((_url, _key, options) => {
        boundary.cookies = options.cookies;
        return { auth: { getUser: boundary.getUser } };
    });
    boundary.getUser.mockResolvedValue({ data: { user: null }, error: null });
});
test('propagates refresh cookies and SDK cache headers across repeated writes', async () => {
    const request = new NextRequest('https://shop.test/cart', {
        headers: { cookie: 'sb-old=value; preference=dark' },
    });
    boundary.getUser.mockImplementation(async () => {
        expect(boundary.cookies!.getAll()).toEqual(
            expect.arrayContaining([{ name: 'preference', value: 'dark' }]),
        );
        boundary.cookies!.setAll(
            [
                {
                    name: 'sb-access',
                    value: 'new-access',
                    options: { path: '/', httpOnly: true },
                },
            ],
            {
                'Cache-Control': 'private, no-store',
                Expires: '0',
                Pragma: 'no-cache',
            },
        );
        boundary.cookies!.setAll(
            [
                {
                    name: 'sb-refresh',
                    value: 'new-refresh',
                    options: { path: '/' },
                },
            ],
            {},
        );
        return { data: { user: { id: 'member' } }, error: null };
    });
    const response = await refreshSupabaseSession(request);
    expect(request.cookies.get('sb-access')?.value).toBe('new-access');
    expect(response.headers.get('x-middleware-request-cookie')).toContain(
        'sb-refresh=new-refresh',
    );
    expect(response.cookies.get('sb-access')?.value).toBe('new-access');
    expect(response.cookies.get('sb-refresh')?.value).toBe('new-refresh');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(response.headers.get('expires')).toBe('0');
});
test('missing configuration does not break a public request', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    expect(
        (await refreshSupabaseSession(new NextRequest('https://shop.test/')))
            .status,
    ).toBe(200);
    expect(boundary.create).not.toHaveBeenCalled();
});
test('auth service failure does not globally block public pages', async () => {
    boundary.getUser.mockRejectedValue(new Error('offline'));
    expect(
        (await refreshSupabaseSession(new NextRequest('https://shop.test/')))
            .status,
    ).toBe(200);
});
