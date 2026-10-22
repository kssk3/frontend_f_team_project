import { beforeEach, expect, test, vi } from 'vitest';

// 실제 Supabase 대신 연결 객체를 "언제, 몇 번" 만드는지만 기록한다
const ssr = vi.hoisted(() => ({
    createBrowserClient: vi.fn(),
    createServerClient: vi.fn(),
}));
vi.mock('@supabase/ssr', () => ssr);

beforeEach(() => {
    // 테스트마다 supabase.ts 를 처음 불러오는 상태로 되돌린다
    vi.resetModules();
    ssr.createBrowserClient
        .mockReset()
        .mockImplementation(() => ({ auth: { getSession: vi.fn() } }));
});

test('파일을 불러오기만 해서는 브라우저용 연결 객체를 만들지 않는다', async () => {
    await import('./supabase');

    expect(ssr.createBrowserClient).not.toHaveBeenCalled();
});

test('getBrowserClient()는 처음 부를 때 한 번만 만들고 그 뒤에는 같은 객체를 쓴다', async () => {
    const { getBrowserClient } = await import('./supabase');

    const first = getBrowserClient();
    const second = getBrowserClient();

    expect(first).toBe(second);
    expect(ssr.createBrowserClient).toHaveBeenCalledTimes(1);
});

test('기존 supabase 도 처음 쓰는 순간에 만들어지고 getBrowserClient()와 같은 객체를 쓴다', async () => {
    const { supabase, getBrowserClient } = await import('./supabase');
    expect(ssr.createBrowserClient).not.toHaveBeenCalled();

    expect(supabase.auth).toBe(getBrowserClient().auth);
    expect(ssr.createBrowserClient).toHaveBeenCalledTimes(1);
});
