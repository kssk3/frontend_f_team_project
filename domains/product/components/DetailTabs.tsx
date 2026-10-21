'use client';

import { cn } from '@/shared/utils/cn';
// useRef = 필요할 때 요소에 직접 위치 참조시킴
import { useRef, useState } from 'react';

const TABS = [
    { key: 'description', label: '상품 설명' },
    { key: 'review', label: '리뷰', count: 0 },
    { key: 'faq', label: '문의', count: 0 },
] as const;

// TABS 추가하면 타입 자동으로 따라오게 함
type TabKey = (typeof TABS)[number]['key'];

interface DetailTabsProps {
    description: React.ReactNode;
}

export default function DetailTabs({ description }: DetailTabsProps) {
    // 초깃값은 '상품 설명' description으로 설정
    const [active, setActive] = useState<TabKey>('description');
    const sectionRef = useRef<HTMLElement>(null);

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
                        {'count' in t && <span>[{t.count}]</span>}
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
                    className="py-20 text-center text-sm text-neutral-400"
                >
                    아직 등록된 문의가 없습니다.
                </div>
            </div>
        </section>
    );
}
