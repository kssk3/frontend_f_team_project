// @vitest-environment node
// (app 폴더를 파일 경로로 읽기 위해 DOM 이 아닌 node 환경에서 실행)
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { IMPLEMENTED_ROUTES, isImplemented } from './implementedRoutes';

describe('isImplemented', () => {
    test.each(['/', '/help/vendor', '/cart', '/login', '/member/join/form'])(
        '만들어진 페이지 %s 는 true',
        (href) => {
            expect(isImplemented(href)).toBe(true);
        },
    );

    test.each([
        '/help/faq',
        '/women',
        '/women/clothing/outer',
        '/events/oatline-launch',
        '/mypage',
    ])('아직 없는 페이지 %s 는 false', (href) => {
        expect(isImplemented(href)).toBe(false);
    });

    test('쿼리·해시·끝 슬래시는 무시하고 경로만 본다', () => {
        expect(isImplemented('/login?next=/cart')).toBe(true);
        expect(isImplemented('/help/vendor#form')).toBe(true);
        expect(isImplemented('/cart/')).toBe(true);
        expect(isImplemented('/brand?range=a-m')).toBe(false);
    });

    test('동적 경로 [id] 는 한 칸만 대신한다', () => {
        expect(isImplemented('/product/3f2a-uuid')).toBe(true);
        expect(isImplemented('/product')).toBe(false);
        expect(isImplemented('/product/a/b')).toBe(false);
        expect(isImplemented('/products/1')).toBe(false);
    });

    test('외부 주소는 판단하지 않고 그대로 둔다', () => {
        expect(isImplemented('https://example.com')).toBe(true);
        expect(isImplemented('mailto:help@example.com')).toBe(true);
    });
});

// app 폴더의 page.tsx 위치를 주소로 바꾼다: app/(shop)/product/[id]/page.tsx → /product/[id]
function appPageRoutes() {
    const appDir = fileURLToPath(new URL('../../app', import.meta.url));
    return readdirSync(appDir, { recursive: true, encoding: 'utf8' })
        .filter((file) => /(^|\/)page\.tsx$/.test(file))
        .map((file) => {
            const segments = file
                .split('/')
                .slice(0, -1)
                .filter((segment) => !/^\(.*\)$/.test(segment));
            return `/${segments.join('/')}`;
        })
        .sort();
}

test('구현 목록은 app 폴더의 실제 페이지와 같다 (페이지를 추가하면 목록에도 추가)', () => {
    expect([...IMPLEMENTED_ROUTES].sort()).toEqual(appPageRoutes());
});
