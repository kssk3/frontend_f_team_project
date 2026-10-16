// 상세 페이지가 쓰는 상품 모양.
// 지금은 메인 DISCOVER mock 에서 만든 데이터 활용(임시), Supabase 연결 시 products 테이블에서 채워짐
export type Product = {
    id: number;
    name: string; // ← DiscoverItem.title
    category: string; // ← DiscoverItem.subtitle ('Style #트렌치' 등)
    image: string;
    alt: string;
    tags: string[];
};
