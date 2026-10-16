import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'session';
const SESSION_DAYS = 7;

type SessionPayload = {
    userId: string;
};

function getKey() {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('SESSION_SECRET 환경변수가 설정되지 않았습니다.');
    }
    return new TextEncoder().encode(secret);
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    const token = await new SignJWT({ userId } satisfies SessionPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(getKey());

    (await cookies()).set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    });
}

/** 유효한 세션이면 payload, 없거나 만료/위조면 null */
export async function getSession(): Promise<SessionPayload | null> {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify<SessionPayload>(token, getKey(), {
            algorithms: ['HS256'],
        });
        return payload;
    } catch {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete(COOKIE_NAME);
}
