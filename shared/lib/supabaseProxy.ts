import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Refresh session cookies before rendering; authorization stays in the DAL. */
export async function refreshSupabaseSession(request: NextRequest) {
    let response = NextResponse.next({ request });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return response;

    try {
        const supabase = createServerClient(url, key, {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll(cookiesToSet, headers) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    // Rebuild downstream Cookie headers while retaining all earlier writes.
                    const previous = response;
                    response = NextResponse.next({ request });
                    previous.cookies
                        .getAll()
                        .forEach((cookie) => response.cookies.set(cookie));
                    previous.headers.forEach((value, name) => {
                        if (
                            !name.startsWith('x-middleware-') &&
                            name !== 'set-cookie'
                        )
                            response.headers.set(name, value);
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    );
                    Object.entries(headers).forEach(([name, value]) =>
                        response.headers.set(name, value),
                    );
                },
            },
        });
        await supabase.auth.getUser();
    } catch {
        // Unavailable auth must not take down unrelated public pages.
    }
    return response;
}
