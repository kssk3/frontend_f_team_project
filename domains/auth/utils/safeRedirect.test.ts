import { expect, test } from 'vitest';
import { safeRedirect } from './safeRedirect';
test.each([
    null,
    '',
    'https://evil.test',
    '//evil.test',
    'javascript:alert(1)',
    '/\\evil.test',
    '/%5cevil.test',
    '/%2f%2fevil.test',
    '/foo\nbar',
    '/foo%0abar',
    '/a/..//evil.test',
])('rejects unsafe destination %s', (value) => {
    expect(safeRedirect(value)).toBe('/');
});
test.each([
    '/',
    '/cart',
    '/products/p1?size=M#options',
    '/search?q=linen%20shirt',
])('preserves internal destination %s', (value) => {
    expect(safeRedirect(value)).toBe(value);
});
