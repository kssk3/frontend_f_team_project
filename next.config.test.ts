// @vitest-environment node
import { hasRemoteMatch } from 'next/dist/shared/lib/match-remote-pattern';
import { expect, test } from 'vitest';

import nextConfig from './next.config';

// next/image 가 실제로 쓰는 판정 함수로, 상품 사진 주소가 허용되는지 확인한다.
// 허용되지 않은 주소를 DB 에 넣으면 메인 DISCOVER · 상품 상세 이미지가 오류로 깨진다.
const allowed = (url: string) =>
    hasRemoteMatch(
        nextConfig.images?.domains ?? [],
        nextConfig.images?.remotePatterns ?? [],
        new URL(url),
    );

test.each([
    'https://picsum.photos/seed/eql-trench-1/900/1200',
    'https://images.unsplash.com/photo-1619603364904-c0498317e145?w=900&h=1200&fit=crop&q=80',
])('상품 사진 주소 %s 는 허용한다', (url) => {
    expect(allowed(url)).toBe(true);
});

test.each([
    // 유료(Unsplash+) 사진은 쓰지 않는다
    'https://plus.unsplash.com/premium_photo-1674719144570-0728faf14f96',
    // 사진이 아닌 경로·다른 도메인은 막는다
    'https://images.unsplash.com/profile-1600000000000-abc',
    'https://example.com/photo-1.jpg',
    'http://images.unsplash.com/photo-1619603364904-c0498317e145',
])('그 밖의 주소 %s 는 막는다', (url) => {
    expect(allowed(url)).toBe(false);
});
