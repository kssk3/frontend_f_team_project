// ── 타입 ───────────────────────────────────────────
export type GnbLink = {
    label: string;
    href: string;
};

export type GnbColumn = {
    title: GnbLink; // 1단계: '의류 ›'
    items: GnbLink[]; // 2단계: 아우터, 니트 …
};

export type GnbBanner = {
    image: string;
    alt: string;
    title: string;
    href: string;
};

export type GnbPanel = {
    quick: GnbLink[]; // 첫 열: 우먼 · 신상품 · 베스트
    columns: GnbColumn[];
    banners: GnbBanner[]; // 오른쪽 배너 (EQL은 2개)
};

export type GnbMenu = GnbLink & {
    hasBar?: boolean; // 메뉴 오른쪽 구분선
    isRed?: boolean; // 빨간 강조 메뉴
    panel?: GnbPanel; // 패널이 있는 메뉴만 (WOMEN · MEN · LIFE · BRAND)
};

// ── 헬퍼 ───────────────────────────────────────────
// 배너 이미지: EQL 380 × 251 비율, 선명도를 위해 2배 크기로 요청
const banner = (seed: string) => `https://picsum.photos/seed/${seed}/760/502`;

// 2단계 링크를 짧게 만들기: link('/women/clothing', '아우터', 'outer')
const link = (base: string, label: string, slug: string): GnbLink => ({
    label,
    href: `${base}/${slug}`,
});

// ── 데이터 ─────────────────────────────────────────
export const gnbMenus: GnbMenu[] = [
    {
        label: 'WOMEN',
        href: '/women',
        panel: {
            quick: [
                { label: '우먼', href: '/women' },
                { label: '신상품', href: '/women/new' },
                { label: '베스트', href: '/women/best' },
            ],
            columns: [
                {
                    title: { label: '의류', href: '/women/clothing' },
                    items: [
                        link('/women/clothing', '아우터', 'outer'),
                        link('/women/clothing', '니트', 'knit'),
                        link('/women/clothing', '티셔츠', 'tshirt'),
                        link('/women/clothing', '스웨트 셔츠 / 후디', 'sweat'),
                        link('/women/clothing', '셔츠', 'shirt'),
                        link('/women/clothing', '팬츠', 'pants'),
                        link('/women/clothing', '원피스', 'dress'),
                        link('/women/clothing', '스커트', 'skirt'),
                    ],
                },
                {
                    title: { label: '가방 & 액세서리', href: '/women/acc' },
                    items: [
                        link('/women/acc', '가방', 'bag'),
                        link('/women/acc', '모자 / 캡', 'cap'),
                        link('/women/acc', '시계', 'watch'),
                        link('/women/acc', '선글라스 / 안경', 'eyewear'),
                        link('/women/acc', '주얼리', 'jewelry'),
                    ],
                },
                {
                    title: { label: '슈즈', href: '/women/shoes' },
                    items: [
                        link('/women/shoes', '부츠', 'boots'),
                        link('/women/shoes', '스니커즈', 'sneakers'),
                        link('/women/shoes', '로퍼', 'loafer'),
                        link('/women/shoes', '펌프 / 힐', 'heel'),
                        link('/women/shoes', '샌들', 'sandal'),
                    ],
                },
                {
                    title: { label: '시즌 키워드', href: '/women/keyword' },
                    items: [
                        link('/women/keyword', '반짝이는 무언가', 'shine'),
                        link('/women/keyword', '가벼운 데일리 백', 'daily-bag'),
                        link('/women/keyword', '가을 초콜릿 무드', 'chocolate'),
                        link('/women/keyword', '간절기 아우터', 'season-outer'),
                    ],
                },
            ],
            banners: [
                {
                    image: banner('eql-gnb-women-1'),
                    alt: '모아 아틀리에 니트 컬렉션',
                    title: 'MOA ATELIER 니트 재입고 소식!',
                    href: '/events/moa-atelier-knit',
                },
                {
                    image: banner('eql-gnb-women-2'),
                    alt: '오트라인 신규 입점 컬렉션',
                    title: 'OATLINE 신규 입점, FW 컬렉션 발매',
                    href: '/events/oatline-launch',
                },
            ],
        },
    },
    {
        label: 'MEN',
        href: '/men',
        panel: {
            quick: [
                { label: '맨', href: '/men' },
                { label: '신상품', href: '/men/new' },
                { label: '베스트', href: '/men/best' },
            ],
            columns: [
                {
                    title: { label: '의류', href: '/men/clothing' },
                    items: [
                        link('/men/clothing', '아우터', 'outer'),
                        link('/men/clothing', '니트', 'knit'),
                        link('/men/clothing', '셔츠', 'shirt'),
                        link('/men/clothing', '팬츠', 'pants'),
                        link('/men/clothing', '데님', 'denim'),
                    ],
                },
                {
                    title: { label: '가방 & 액세서리', href: '/men/acc' },
                    items: [
                        link('/men/acc', '가방', 'bag'),
                        link('/men/acc', '모자 / 캡', 'cap'),
                        link('/men/acc', '벨트', 'belt'),
                    ],
                },
                {
                    title: { label: '슈즈', href: '/men/shoes' },
                    items: [
                        link('/men/shoes', '스니커즈', 'sneakers'),
                        link('/men/shoes', '부츠', 'boots'),
                        link('/men/shoes', '로퍼', 'loafer'),
                    ],
                },
            ],
            banners: [
                {
                    image: banner('eql-gnb-men-1'),
                    alt: '노스폴드 아우터 컬렉션',
                    title: 'NORTHFOLD 아우터 기획전',
                    href: '/events/northfold-outer',
                },
                {
                    image: banner('eql-gnb-men-2'),
                    alt: '그레이 아카이브 데님 라인',
                    title: 'GREY ARCHIVE 데님 단독 발매',
                    href: '/events/grey-archive-denim',
                },
            ],
        },
    },
    {
        label: 'LIFE',
        href: '/life',
        hasBar: true,
        panel: {
            quick: [
                { label: '라이프', href: '/life' },
                { label: '신상품', href: '/life/new' },
            ],
            columns: [
                {
                    title: { label: '홈', href: '/life/home' },
                    items: [
                        link('/life/home', '침구', 'bedding'),
                        link('/life/home', '조명', 'lighting'),
                        link('/life/home', '수납', 'storage'),
                    ],
                },
                {
                    title: { label: '키친', href: '/life/kitchen' },
                    items: [
                        link('/life/kitchen', '식기', 'tableware'),
                        link('/life/kitchen', '컵 / 머그', 'cup'),
                    ],
                },
                {
                    title: { label: '취미', href: '/life/hobby' },
                    items: [
                        link('/life/hobby', '도서', 'book'),
                        link('/life/hobby', '문구', 'stationery'),
                        link('/life/hobby', '향수 / 디퓨저', 'scent'),
                    ],
                },
            ],
            banners: [
                {
                    image: banner('eql-gnb-life-1'),
                    alt: '소프트 캐빈 홈웨어',
                    title: 'SOFT CABIN 홈웨어 15% 할인',
                    href: '/events/soft-cabin-home',
                },
                {
                    image: banner('eql-gnb-life-2'),
                    alt: '플레인 노트 문구 컬렉션',
                    title: 'PLAIN NOTE 문구 신상품',
                    href: '/events/plain-note',
                },
            ],
        },
    },
    {
        label: 'BRAND',
        href: '/brand',
        panel: {
            quick: [
                { label: '브랜드 전체', href: '/brand' },
                { label: '신규 입점', href: '/brand/new' },
                { label: 'EQL 단독', href: '/brand/exclusive' },
            ],
            columns: [
                {
                    title: { label: 'A – M', href: '/brand?range=a-m' },
                    items: [
                        link('/brand', 'DAWN STUDIO', 'dawn-studio'),
                        link('/brand', 'GREY ARCHIVE', 'grey-archive'),
                        link('/brand', 'HALF MOON KNIT', 'half-moon-knit'),
                        link('/brand', 'MOA ATELIER', 'moa-atelier'),
                    ],
                },
                {
                    title: { label: 'N – Z', href: '/brand?range=n-z' },
                    items: [
                        link('/brand', 'NORTHFOLD', 'northfold'),
                        link('/brand', 'OATLINE', 'oatline'),
                        link('/brand', 'PLAIN NOTE', 'plain-note'),
                        link('/brand', 'SOFT CABIN', 'soft-cabin'),
                        link('/brand', 'TIDE & STONE', 'tide-and-stone'),
                        link('/brand', 'URBAN FERN', 'urban-fern'),
                    ],
                },
            ],
            banners: [
                {
                    image: banner('eql-gnb-brand-1'),
                    alt: '던 스튜디오 가방 컬렉션',
                    title: 'DAWN STUDIO 첫 구매 20% 쿠폰',
                    href: '/events/dawn-studio-bag',
                },
                {
                    image: banner('eql-gnb-brand-2'),
                    alt: '타이드 앤 스톤 슈즈',
                    title: 'TIDE & STONE 무료 배송 기획전',
                    href: '/events/tide-and-stone-shoes',
                },
            ],
        },
    },
    // ── 패널 없는 메뉴: panel 생략 ──
    { label: 'EQL EXCLUSIVE', href: '/exclusive' },
    { label: 'PERFORMANCE CLUB', href: '/performance' },
    { label: 'OUTLET', href: '/outlet' },
    { label: 'EVENT', href: '/event', isRed: true },
    { label: 'DISCOVER', href: '/discover' },
    { label: 'SHOP IN SHOP', href: '/shop-in-shop', hasBar: true },
    { label: 'Mid Season Curation + 1', href: '/curation', isRed: true },
];
