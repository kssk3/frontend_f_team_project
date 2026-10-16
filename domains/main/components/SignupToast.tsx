'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

// 로그인 전 메인에서 보여주는 회원가입 유도 토스트
// 토스 '자산관리 리포트' 플로팅 카드 패턴 참고 (toss.tech/article/asset_management)
// - 메인에 들어오면 화면 중앙에 카드가 펼쳐짐
// - X를 누르거나 스크롤하면 오른쪽 아래 작은 칩으로 줄어듦 → 칩을 누르면 다시 중앙에 펼침

type ToastState = 'hidden' | 'expanded' | 'minimized';

const OPEN_DELAY = 800; // 메인 화면이 먼저 보이도록 잠깐 기다렸다가 펼침
const SIGNUP_HREF = '/login'; // 회원가입 페이지가 생기면 교체

// 칩이 차지하는 높이를 기록하는 CSS 변수 — TopButton이 이 값만큼 위로 비켜감
const SPACE_VAR = '--signup-toast-space';
const SPACE_GAP = 16; // 칩과 TopButton 사이 간격

// 빠르게 시작 → 부드럽게 감속 → 끝에서 살짝 반동 (y값 1.2가 1을 넘어서 반동이 생김)
const EASE_SPRING = 'cubic-bezier(0.22, 1.2, 0.36, 1)';

export default function SignupToast({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [state, setState] = useState<ToastState>('hidden');
    const expanded = state === 'expanded';
    const minimized = state === 'minimized';
    const chipRef = useRef<HTMLButtonElement>(null);

    // 1) 화면이 보인 뒤 중앙에 펼치기 (이미 스크롤된 상태로 새로고침했다면 칩으로 시작)
    useEffect(() => {
        if (isLoggedIn) return;
        const timer = setTimeout(() => {
            setState(window.scrollY > 0 ? 'minimized' : 'expanded');
        }, OPEN_DELAY);
        return () => clearTimeout(timer);
    }, [isLoggedIn]);

    // 2) 펼쳐진 상태에서 스크롤하면 칩으로 줄어듦 (다른 콘텐츠에 자리를 내어줌)
    useEffect(() => {
        if (!expanded) return;
        const onScroll = () => setState('minimized');
        window.addEventListener('scroll', onScroll, {
            passive: true,
            once: true,
        });
        return () => window.removeEventListener('scroll', onScroll);
    }, [expanded]);

    // 3) 칩이 보일 때만 그 높이를 CSS 변수로 알려서 TopButton이 칩 위에 오게 함
    //    (중앙 카드는 오른쪽 아래를 차지하지 않으므로 0)
    useEffect(() => {
        const chip = chipRef.current;
        const space = minimized && chip ? chip.offsetHeight + SPACE_GAP : 0;
        document.documentElement.style.setProperty(SPACE_VAR, `${space}px`);
    }, [minimized]);

    // 메인을 벗어나면(언마운트) TopButton을 원래 위치로 돌려놓음
    useEffect(() => {
        return () => {
            document.documentElement.style.removeProperty(SPACE_VAR);
        };
    }, []);

    // 지금은 비로그인 기준 메시지만 제공 (로그인 상태용 메시지는 추후 정의)
    if (isLoggedIn) return null;

    return (
        // 화면 전체를 덮는 레이어지만 pointer-events-none이라 아래 콘텐츠 클릭을 막지 않음
        <aside
            aria-label="신규 회원 혜택"
            className="pointer-events-none fixed inset-0 z-[400] grid place-items-center"
        >
            {/* 중앙 카드 — translate와 scale의 시작 시점을 60ms 어긋나게 해서 곡선처럼 움직임 */}
            <div
                inert={!expanded}
                style={{
                    transitionProperty: 'translate, scale, opacity',
                    transitionDuration: '500ms, 500ms, 250ms',
                    transitionDelay: expanded ? '0ms, 60ms, 0ms' : '0ms',
                    transitionTimingFunction: `${EASE_SPRING}, ${EASE_SPRING}, ease-out`,
                }}
                className={cn(
                    'w-[360px] rounded-[24px] border border-white/10 bg-[rgba(28,28,32,0.78)] p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl motion-reduce:!transition-none',
                    expanded && 'pointer-events-auto scale-100 opacity-100',
                    // 처음 등장 전: 살짝 아래에서 떠오름
                    state === 'hidden' && 'translate-y-4 scale-90 opacity-0',
                    // 작아질 때: 칩이 있는 오른쪽 아래로 날아가며 줄어듦
                    minimized &&
                        'translate-x-[35vw] translate-y-[40vh] scale-50 opacity-0',
                )}
            >
                <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-[#8fb4ff]">
                        ✨ 신규 회원 혜택
                    </p>
                    <button
                        type="button"
                        onClick={() => setState('minimized')}
                        aria-label="작게 보기"
                        className="-mr-1 rounded-full p-1 text-white/40 transition-colors hover:text-white/80"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* 그래픽보다 내용이 먼저 보이도록 텍스트 중심 */}
                <p className="mt-3 text-[15px] leading-[1.5] text-white/80">
                    지금 가입하면 첫 구매에 쓸 수 있는
                    <br />
                    <strong className="font-semibold text-white">
                        20% 할인 쿠폰
                    </strong>
                    을 바로 드려요.
                </p>

                <Link
                    href={SIGNUP_HREF}
                    className="mt-5 flex h-12 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,rgba(143,180,255,0.28),rgba(143,180,255,0.14))] text-[15px] font-semibold text-[#cfdcff] transition-colors hover:bg-[linear-gradient(180deg,rgba(143,180,255,0.36),rgba(143,180,255,0.2))]"
                >
                    회원가입하고 쿠폰 받기
                </Link>
            </div>

            {/* 작아진 칩 — 오른쪽 맨 아래, 궁금할 때 다시 열어볼 수 있는 진입점 */}
            <button
                ref={chipRef}
                type="button"
                inert={!minimized}
                onClick={() => setState('expanded')}
                aria-expanded={false}
                className={cn(
                    'absolute right-[30px] bottom-[30px] flex h-11 origin-bottom-right items-center gap-1.5 rounded-full border border-white/10 bg-[rgba(28,28,32,0.78)] px-4 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-[scale,opacity] duration-300 motion-reduce:transition-none',
                    minimized
                        ? 'pointer-events-auto scale-100 opacity-100 delay-150'
                        : 'scale-75 opacity-0',
                )}
            >
                <span className="text-[#8fb4ff]">✨</span>
                가입하면 20% 쿠폰
            </button>
        </aside>
    );
}
