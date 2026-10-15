import type { BannerItem } from './types';

// 학습용 mock 데이터
// - 브랜드명은 모두 가상의 이름입니다 (실제 브랜드 상표 사용 X)
// - 이미지는 Lorem Picsum(무료 사진) seed URL — 같은 seed는 항상 같은 사진을 돌려줍니다
// - 크기는 EQL 원본 배너 비율(1337 × 827)에 맞췄습니다
// - href의 /events/* 라우트는 아직 없으므로 클릭 시 404가 정상입니다
const BANNER_SIZE = '1337/827';

const picsum = (seed: string) => `https://picsum.photos/seed/${seed}/${BANNER_SIZE}`;

export const mockBanners: BannerItem[] = [
    {
        id: 1,
        href: '/events/moa-atelier-fw',
        image: picsum('eql-banner-01'),
        alt: '모아 아틀리에 가을 겨울 컬렉션 캠페인 이미지',
        brand: 'MOA ATELIER',
        benefit: 'FW 신상품 단독 선공개 + 10% 쿠폰',
    },
    {
        id: 2,
        href: '/events/oatline-knit',
        image: picsum('eql-banner-02'),
        alt: '오트라인 니트 컬렉션 캠페인 이미지',
        brand: 'OATLINE',
        benefit: '니트 전 상품 최대 30% 할인',
    },
    {
        id: 3,
        href: '/events/northfold-outer',
        image: picsum('eql-banner-03'),
        alt: '노스폴드 아우터 컬렉션 캠페인 이미지',
        brand: 'NORTHFOLD',
        benefit: '아우터 기획전 · 구매 시 적립금 5천원',
    },
    {
        id: 4,
        href: '/events/grey-archive-denim',
        image: picsum('eql-banner-04'),
        alt: '그레이 아카이브 데님 라인 캠페인 이미지',
        brand: 'GREY ARCHIVE',
        benefit: 'EXCLUSIVE 데님 라인 단독 발매',
    },
    {
        id: 5,
        href: '/events/soft-cabin-home',
        image: picsum('eql-banner-05'),
        alt: '소프트 캐빈 홈웨어 컬렉션 캠페인 이미지',
        brand: 'SOFT CABIN',
        benefit: '홈웨어 2개 이상 구매 시 15% 할인',
    },
    {
        id: 6,
        href: '/events/dawn-studio-bag',
        image: picsum('eql-banner-06'),
        alt: '던 스튜디오 가방 컬렉션 캠페인 이미지',
        brand: 'DAWN STUDIO',
        benefit: '첫 구매 고객 20% 웰컴 쿠폰',
    },
    {
        id: 7,
        href: '/events/plain-note-basic',
        image: picsum('eql-banner-07'),
        alt: '플레인 노트 베이직 티셔츠 캠페인 이미지',
        brand: 'PLAIN NOTE',
        benefit: '베이직 티셔츠 1+1 이벤트',
    },
    {
        id: 8,
        href: '/events/tide-and-stone-shoes',
        image: picsum('eql-banner-08'),
        alt: '타이드 앤 스톤 슈즈 컬렉션 캠페인 이미지',
        brand: 'TIDE & STONE',
        benefit: '슈즈 기획전 · 무료 배송 + 무료 반품',
    },
    {
        id: 9,
        href: '/events/half-moon-knit-accessory',
        image: picsum('eql-banner-09'),
        alt: '하프문 니트 액세서리 컬렉션 캠페인 이미지',
        brand: 'HALF MOON KNIT',
        benefit: '머플러·비니 최대 40% 할인',
    },
    {
        id: 10,
        href: '/events/urban-fern-weekend',
        image: picsum('eql-banner-10'),
        alt: '어반 펀 위크엔드 컬렉션 캠페인 이미지',
        brand: 'URBAN FERN',
        benefit: '주말 한정 타임세일 · 최대 50%',
    },
];
