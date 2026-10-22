export type BannerItem = {
    id: number;
    href: string;
    image: string;
    alt: string;
    brand: string;
    benefit: string;
};

// 메인 DISCOVER 카드 — DB 상품(products) 한 개를 카드 모양으로 바꾼 값 (utils/discoverItems.ts)
export type DiscoverItem = {
    productId: string; // products.id (UUID) — 카드를 누르면 /product/{productId}
    image: string; // 대표 사진 주소, 사진이 없으면 '' (회색 상자)
    alt: string;
    title: string; // products.name
    subtitle: string; // products.category (예: 'Style #트렌치')
    tags: string[]; // [브랜드명]
};
