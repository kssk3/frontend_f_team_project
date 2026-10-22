/** Accept only a same-origin absolute path, never a URL or ambiguous encoding. */
export function safeRedirect(value: string | null | undefined): string {
    if (!value) return '/';
    let decoded = value;
    try {
        for (let attempt = 0; attempt < 5; attempt++) {
            if (
                !decoded.startsWith('/') ||
                decoded.startsWith('//') ||
                /[\\\u0000-\u001f\u007f]/.test(decoded)
            )
                return '/';
            const next = decodeURIComponent(decoded);
            if (next === decoded) break;
            decoded = next;
        }
        const url = new URL(decoded, 'https://internal.invalid');
        if (
            url.origin !== 'https://internal.invalid' ||
            url.pathname.startsWith('//')
        )
            return '/';
        return value;
    } catch {
        return '/';
    }
}
