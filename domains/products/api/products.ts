// mock 데이터, 이후 Supabase 연결 시 삭제 예정
import { mockDiscover } from '@/domains/main/data/mockDiscover';
import type { DiscoverItem } from '@/domains/main/types';

import type { Product } from '../types';

// mock 한 칸 → 상세 페이지용 Product. 데이터 출처가 바뀌었을 때 이쪽 함수 고치기
const toProduct = (item: DiscoverItem): Product => ({
    id: item.id,
    name: item.title,
    category: item.subtitle,
    image: item.image,
    alt: item.alt,
    tags: item.tags,
});

// URL 의 id 는 항상 문자열('3') mock 의 id 는 숫자(3) → Number 로 바꿔 비교
// 없는 id(또는 'abc' → NaN)면 undefined 를 돌려주고, 404 처리는 라우트가 맡음
export async function getProduct(id: string): Promise<Product | undefined> {
    const item = mockDiscover.find((d) => d.id === Number(id));
    return item && toProduct(item);
}
