import { cookies } from 'next/headers';

/** Server Actions only: remove the current browser's auth and obsolete session cookies. */
export async function clearLoginCookies() {
    const store = await cookies();
    for (const { name } of store.getAll()) {
        if (name.startsWith('sb-') || name === 'session') store.delete(name);
    }
}
