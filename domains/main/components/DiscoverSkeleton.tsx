// DISCOVER 상품을 불러오는 동안 보여 줄 자리 — RecommendSection 과 같은 여백 · 카드 폭(4.1장 · 간격 10px)
const SKELETON_COUNT = 5;

export default function DiscoverSkeleton() {
    return (
        <section
            aria-hidden
            className="flex gap-[10px] overflow-hidden pt-[60px] pb-[150px] pl-[30px]"
        >
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <div
                    key={index}
                    data-skeleton-card
                    className="w-[calc((100%-31px)/4.1)] shrink-0"
                >
                    <div className="aspect-[3/4] bg-[#f2f2f2]" />
                    <div className="mt-5 h-6 w-3/5 bg-[#f2f2f2]" />
                    <div className="mt-2 h-4 w-2/5 bg-[#f2f2f2]" />
                </div>
            ))}
        </section>
    );
}
