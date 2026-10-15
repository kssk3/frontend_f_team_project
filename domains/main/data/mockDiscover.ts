import type { DiscoverItem } from '../types';

// 학습용 mock 데이터 (EQL 메인 DISCOVER 카드 구조 참고)
// - 실제 브랜드 상표 대신 가상의 키워드를 사용합니다
// - 이미지는 Lorem Picsum seed URL — 카드 비율 3:4 (618 × 824)
// - subtitle은 EQL과 같은 '분류 #키워드' 형식 (Style / Item / Brand)

const CARD_SIZE = '618/824';

const picsum = (seed: string) =>
    `https://picsum.photos/seed/${seed}/${CARD_SIZE}`;

export const mockDiscover: DiscoverItem[] = [
    {
        id: 1,
        href: '/discover/classic-trench',
        image: picsum('eql-discover-01'),
        alt: '가을 클래식 트렌치 코트 스타일링',
        title: '가을 클래식 트렌치',
        subtitle: 'Style #트렌치',
        tags: ['하이넥', '하프트렌치', '가을치트키'],
    },
    {
        id: 2,
        href: '/discover/autumn-taste',
        image: picsum('eql-discover-02'),
        alt: '밤색 톤의 가을 액세서리 모음',
        title: '가을의 맛 🌰',
        subtitle: 'Item #보늬밤',
        tags: ['반지', '팔찌', '목걸이'],
    },
    {
        id: 3,
        href: '/discover/knit-now',
        image: picsum('eql-discover-03'),
        alt: '컬러 니트 스타일링',
        title: '요즘 니트',
        subtitle: 'Style #니트',
        tags: ['컬러니트', '브이넥니트', '오프숄더'],
    },
    {
        id: 4,
        href: '/discover/hangul-day',
        image: picsum('eql-discover-04'),
        alt: '필사 노트와 시집이 놓인 책상',
        title: '한글을 사랑하는 마음으로',
        subtitle: 'Item #한글날',
        tags: ['필사', '시집', '독서'],
    },
    {
        id: 5,
        href: '/discover/raglan-pick',
        image: picsum('eql-discover-05'),
        alt: '래글런 티셔츠 코디',
        title: '골라 입는 래글런',
        subtitle: 'Item #래글런티',
        tags: ['래글런', '래글런티', '코디'],
    },
    {
        id: 6,
        href: '/discover/northfold-heritage',
        image: picsum('eql-discover-06'),
        alt: '노스폴드 헤리티지 아우터 컬렉션',
        title: '가장 미래적인 클래식',
        subtitle: 'Brand #NORTHFOLD',
        tags: ['아우터', '헤리티지', '아카이브'],
    },
    {
        id: 7,
        href: '/discover/weekend-sneakers',
        image: picsum('eql-discover-07'),
        alt: '주말 산책용 스니커즈 모음',
        title: '밑창 하나로 달라지는 주말',
        subtitle: '모두를 위한 트렌드백과',
        tags: ['신발', '스니커즈', '산책'],
    },
    {
        id: 8,
        href: '/discover/layered-shirts',
        image: picsum('eql-discover-08'),
        alt: '셔츠 레이어드 스타일링',
        title: '셔츠 한 장으로 완성하는 레이어드',
        subtitle: 'Style #레이어드',
        tags: ['셔츠', '레이어드', '데일리룩'],
    },
    {
        id: 9,
        href: '/discover/scent-library',
        image: picsum('eql-discover-09'),
        alt: '가을 향수와 디퓨저 컬렉션',
        title: '계절을 담은 향기 도서관',
        subtitle: 'Item #향수',
        tags: ['향수', '디퓨저', '선물추천'],
    },
    {
        id: 10,
        href: '/discover/moa-atelier-muffler',
        image: picsum('eql-discover-10'),
        alt: '모아 아틀리에 머플러와 비니',
        title: '찬바람이 불면 꺼내는 머플러',
        subtitle: 'Brand #MOA ATELIER',
        tags: ['머플러', '비니', '겨울준비'],
    },
];
