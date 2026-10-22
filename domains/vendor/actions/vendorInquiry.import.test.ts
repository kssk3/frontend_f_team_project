import { expect, test } from 'vitest';

// 이 파일은 Supabase 를 가짜로 바꾸지 않는다.
// shared/lib/supabase 가 연결 객체를 필요할 때 만들므로, 환경 변수가 없어도 불러오기만으로는 실패하지 않아야 한다.
test('입점 문의 액션은 불러오기만으로 Supabase 연결을 만들지 않는다', async () => {
    const { submitVendorInquiry } = await import('./vendorInquiry.actions');
    expect(typeof submitVendorInquiry).toBe('function');
});
