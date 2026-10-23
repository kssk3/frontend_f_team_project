'use client';

import { cn } from '@/shared/utils/cn';
// useRef = 필요할 때 요소에 직접 위치 참조시킴
import { useEffect, useRef, useState } from 'react';

const TABS = [
    { key: 'description', label: '상품 설명' },
    { key: 'review', label: '리뷰' },
    { key: 'faq', label: '문의' },
] as const;

// TABS 추가하면 타입 자동으로 따라오게 함
type TabKey = (typeof TABS)[number]['key'];

interface DetailTabsProps {
    description: React.ReactNode;
    inquiry: React.ReactNode; // 문의 목록 — 서버(page.tsx)가 조회해 그려 넣는다. 탭은 DB 를 모른다
    inquiryCount: number; // 탭 라벨의 [N]
}

export default function DetailTabs({ description, inquiry, inquiryCount }: DetailTabsProps) {
    // 초깃값은 '상품 설명' description으로 설정
    const [active, setActive] = useState<TabKey>('description');
    const sectionRef = useRef<HTMLElement>(null);
    // 라벨 옆 [N] — 리뷰는 아직 데이터가 없어 0 고정
    const counts: Partial<Record<TabKey, number>> = { review: 0, faq: inquiryCount };

    // 문의 등록 뒤 /product/{id}#faq 로 돌아오면 문의 탭을 열어 둔다 (탭 상태는 클라이언트에만 있어 해시로 전달)
    // 해시는 서버가 모르는 값이라 초깃값으로 쓰면 hydration 이 어긋난다 → 마운트 뒤 effect 에서 한 번만 읽는다
    useEffect(() => {
        if (window.location.hash !== '#faq') return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- URL 해시(외부 상태)를 마운트 때 한 번 반영
        setActive('faq');
        sectionRef.current?.scrollIntoView({ block: 'start' });
    }, []);

    // 탭 전환 + 스크롤 위치 맞추기
    const selectTab = (key: TabKey) => {
        setActive(key);
        const section = sectionRef.current;
        if (!section) return;
        // 헤더 오프셋 계산
        const headerOffset = parseFloat(getComputedStyle(section).scrollMarginTop);
        if (section.getBoundingClientRect().top < headerOffset) {
            section.scrollIntoView({ block: 'start' });
        }
    };

    return (
        <section ref={sectionRef} className="mt-16 scroll-mt-header">
            <div
                role="tablist"
                aria-label="상품 상세 정보"
                className="top-header sticky z-30 grid grid-cols-3 border-y border-neutral-200 bg-white"
            >
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        role="tab"
                        type="button"
                        // id ↔ aria-controls / aria-labelledby 로 탭과 패널을 양방향 연결
                        id={`tab-${t.key}`}
                        aria-selected={active === t.key}
                        aria-controls={`panel-${t.key}`}
                        onClick={() => selectTab(t.key)}
                        className={cn(
                            'relative flex h-14 items-center justify-center gap-2 px-6 text-sm text-neutral-900 transition hover:bg-neutral-50 md:h-16 md:text-lg',
                            active === t.key
                                ? '-mb-px border-b-2 border-neutral-900 font-bold'
                                : 'font-normal',
                        )}
                    >
                        {t.label}
                        {counts[t.key] !== undefined && <span>[{counts[t.key]}]</span>}
                    </button>
                ))}
            </div>

            <div className="pt-8">
                <div
                    role="tabpanel"
                    id="panel-description"
                    // aria-labelledby = "이 패널의 이름은 저 탭 버튼의 글자다"
                    aria-labelledby="tab-description"
                    // 조건부 렌더(&&)로 아예 지우지 않음: 탭 왕복해도 DOM 이 유지돼 상품 설명 이미지를 다시 불러오지 않음
                    //   숨긴 패널도 HTML 에 남아 검색 엔진이 처음부터 읽을 수 있다.
                    //   (읽던 스크롤 위치는 보존되지 않음 — selectTab 이 탭을 누를 때마다 섹션 맨 위로 맞춤)
                    hidden={active !== 'description'}
                >
                    {description}
                </div>
                <div
                    role="tabpanel"
                    id="panel-review"
                    aria-labelledby="tab-review"
                    hidden={active !== 'review'}
                    className="py-20 text-center text-sm text-neutral-400"
                >
                    아직 등록된 리뷰가 없습니다.
                </div>
                <div
                    role="tabpanel"
                    id="panel-faq"
                    aria-labelledby="tab-faq"
                    hidden={active !== 'faq'}
                >
                    {/* 목록·빈 상태·「문의하기」는 InquiryList 가 그린다 */}
                    {inquiry}
                </div>
            </div>
        </section>
    );
}
