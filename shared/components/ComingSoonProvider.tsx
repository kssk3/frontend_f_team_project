'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { X } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

export const COMING_SOON_MESSAGE = '아직 준비 중인 페이지입니다.';
export const COMING_SOON_AUTO_CLOSE_MS = 4000;

// 메인 SignupToast 와 같은 곡선: 빠르게 시작 → 부드럽게 감속 → 끝에서 살짝 반동
const EASE_SPRING = 'cubic-bezier(0.22, 1.2, 0.36, 1)';

// 준비 중 안내를 여는 함수. Provider 밖이면 undefined (NavLink 는 막지 않고 그냥 이동)
const ComingSoonContext = createContext<(() => void) | undefined>(undefined);

export function useOpenComingSoon() {
    return useContext(ComingSoonContext);
}

// 아직 없는 페이지로 가는 메뉴를 눌렀을 때 헤더 아래에 잠깐 떠오르는 안내 토스트.
// 디자인은 메인의 SignupToast(유리 카드 · 강조 라벨 · 그라데이션 버튼)를 따른다.
// 모달이 아니라 화면을 가리거나 포커스를 옮기지 않고, 확인 · X · Escape · 4초 뒤 닫힌다.
export default function ComingSoonProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    // 떠 있는 동안 다시 열면 값이 바뀌어 자동 닫힘 시간을 처음부터 센다
    const [openCount, setOpenCount] = useState(0);

    const openComingSoon = useCallback(() => {
        setOpen(true);
        setOpenCount((count) => count + 1);
    }, []);
    const close = () => setOpen(false);

    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(
            () => setOpen(false),
            COMING_SOON_AUTO_CLOSE_MS,
        );
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, openCount]);

    return (
        <ComingSoonContext.Provider value={openComingSoon}>
            {children}

            {/* 헤더(100px) 바로 아래 가운데 — 메인 중앙 SignupToast · 오른쪽 아래 칩과 겹치지 않는 자리 */}
            {/* 헤더(z-501) · 드롭다운보다 위에 오도록 z-[600] */}
            <div className="pointer-events-none fixed inset-x-0 top-[120px] z-[600] flex justify-center">
                <div
                    role="status"
                    aria-label="준비 중 안내"
                    aria-hidden={!open}
                    inert={!open}
                    style={{
                        transitionProperty:
                            'translate, scale, opacity, visibility',
                        transitionDuration: open
                            ? '500ms, 500ms, 250ms, 0ms'
                            : '300ms, 300ms, 200ms, 300ms',
                        transitionTimingFunction: `${EASE_SPRING}, ${EASE_SPRING}, ease-out, linear`,
                    }}
                    className={cn(
                        'w-[360px] rounded-[24px] border border-white/10 bg-[rgba(28,28,32,0.78)] p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl motion-reduce:!transition-none',
                        open
                            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                            : 'invisible -translate-y-3 scale-95 opacity-0',
                    )}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-[#8fb4ff]">
                            🛠 준비 중
                        </p>
                        <button
                            type="button"
                            onClick={close}
                            aria-label="닫기"
                            className="-mr-1 rounded-full p-1 text-white/40 transition-colors hover:text-white/80"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <p className="mt-3 text-[15px] leading-[1.5] text-white/80">
                        <strong className="font-semibold text-white">
                            {COMING_SOON_MESSAGE}
                        </strong>
                        <br />
                        조금만 기다려 주세요.
                    </p>

                    <button
                        type="button"
                        onClick={close}
                        className="mt-5 flex h-12 w-full items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,rgba(143,180,255,0.28),rgba(143,180,255,0.14))] text-[15px] font-semibold text-[#cfdcff] transition-colors hover:bg-[linear-gradient(180deg,rgba(143,180,255,0.36),rgba(143,180,255,0.2))]"
                    >
                        확인
                    </button>
                </div>
            </div>
        </ComingSoonContext.Provider>
    );
}
