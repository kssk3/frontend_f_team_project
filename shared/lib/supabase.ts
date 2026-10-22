import { createBrowserClient, createServerClient as createSSRServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

// 연결 객체를 만들 때만 확인한다 (파일을 불러올 때마다 경고가 찍히지 않게)
function warnIfEnvMissing() {
    if(!supabaseUrl || !supabasePublishableKey) {
        console.warn('NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY가 설정되지 않았습니다.');
    }
}

//CSR supabase 연결 객체 — 브라우저에서 처음 부를 때 한 번만 만든다
let browserClient: SupabaseClient | undefined;

export function getBrowserClient(): SupabaseClient {
    if (!browserClient) {
        warnIfEnvMissing();
        browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
    }
    return browserClient;
}

/**
 * @deprecated getBrowserClient() 를 사용하세요.
 * 기존 코드가 바로 깨지지 않도록 남겨 둔 것으로, 처음 사용할 때 getBrowserClient() 의 객체를 만든다.
 * 모든 사용처가 getBrowserClient() 로 바뀌면 삭제한다.
 */
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, property) {
        const client = getBrowserClient();
        const value = Reflect.get(client, property, client);
        return typeof value === 'function' ? value.bind(client) : value;
    },
});

//SSR supabase 연결 객체
export function createServerClient(): SupabaseClient {
    warnIfEnvMissing();
    return createSSRServerClient(supabaseUrl,supabasePublishableKey, {
        cookies: {
            async getAll() {
                const { cookies } = await import('next/headers');
                const cookieStore = await cookies();
                return cookieStore.getAll();
                },
                async setAll(cookiesToSet) {
                try {
                const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                        });
                    } catch {
                    // 서버 컴포넌트(RSC) 렌더링 중 쿠키 쓰기 시도는 무시하고
                    // Server Actions 및 Middleware에서 쿠키 갱신을 처리합니다.
                }
            },
        },
    })
}