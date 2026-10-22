import { connection } from 'next/server';

import { getDiscoverProducts } from '../queries/getDiscoverProducts.query';
import RecommendSection from './RecommendSection';

// 메인 DISCOVER: DB 상품(상품명 · 분류 · 브랜드 · 대표 사진)으로 카드를 그린다
export default async function DiscoverSection() {
    // 요청마다 새로 그린다고 알린다 — 상품 상세(/product/[id])와 같은 이유 (Supabase Auth 의 Date.now())
    await connection();
    const items = await getDiscoverProducts();

    // 보여 줄 상품이 없으면(조회 실패 포함) 영역 자체를 빼서 빈 슬라이드가 보이지 않게 한다
    if (items.length === 0) return null;

    return <RecommendSection items={items} />;
}
