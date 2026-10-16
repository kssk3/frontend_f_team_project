import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

// DB 도입 전 임시 저장소: data/users.json
// DB를 붙이면 이 파일의 함수 구현만 교체하면 된다.

const scryptAsync = promisify(scrypt) as (
    password: string,
    salt: string,
    keylen: number,
) => Promise<Buffer>;

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

type StoredUser = {
    id: string;
    loginId: string;
    name: string;
    passwordHash: string; // "salt:hash" (hex, scrypt 64바이트)
};

export type User = Pick<StoredUser, 'id' | 'loginId' | 'name'>;

async function readUsers(): Promise<StoredUser[]> {
    return JSON.parse(await readFile(USERS_FILE, 'utf-8'));
}

async function verifyPassword(password: string, passwordHash: string) {
    const [salt, hash] = passwordHash.split(':');
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = await scryptAsync(password, salt, expected.length);
    return timingSafeEqual(actual, expected);
}

const toUser = ({ id, loginId, name }: StoredUser): User => ({
    id,
    loginId,
    name,
});

/** 아이디/비밀번호가 맞으면 사용자, 아니면 null */
export async function findUserByCredentials(
    loginId: string,
    password: string,
): Promise<User | null> {
    const user = (await readUsers()).find((u) => u.loginId === loginId);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return null;
    }
    return toUser(user);
}

export async function findUserById(id: string): Promise<User | null> {
    const user = (await readUsers()).find((u) => u.id === id);
    return user ? toUser(user) : null;
}
