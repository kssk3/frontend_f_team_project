import 'server-only';

/**
 * reCAPTCHA 토큰을 Google에 검증한다.
 * 개발 환경에서 site key가 없으면 프론트가 토큰 없이 보내므로 검증을 건너뛴다.
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
    if (
        !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
        process.env.NODE_ENV !== 'production'
    ) {
        return true;
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret || !token) return false;

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret, response: token }),
    });
    const data: { success: boolean } = await res.json();
    return data.success;
}
