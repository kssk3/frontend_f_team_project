'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import NavLink from '@/shared/components/NavLink';
import { cn } from '@/shared/utils/cn';
import { gnbMenus } from '@/app/_component/gnb/gnbMenus';
import GnbPanel from '@/app/_component/gnb/GnbPanel';

const barClass =
    'flex items-center gap-[30px] after:block after:h-[10px] after:w-px after:border-r after:border-border';

const redClass = 'text-point font-bold';

type GnbItemProps = {
    href: string;
    children: ReactNode;
    hasBar?: boolean;
    isRed?: boolean;
    isActive: boolean;
    hasPanel: boolean;
    onEnter: () => void;
};

const GnbItem = ({
    href,
    children,
    hasBar = false,
    isRed = false,
    isActive,
    hasPanel,
    onEnter,
}: GnbItemProps) => {
    return (
        <li className={cn('group', hasBar && barClass)} onMouseEnter={onEnter}>
            <NavLink
                href={href}
                onFocus={onEnter}
                aria-expanded={hasPanel ? isActive : undefined}
                className={cn(
                    'text-faint flex items-center gap-1 text-xs leading-[15px] font-medium whitespace-nowrap',
                    isRed && redClass,
                    isActive && !isRed && 'text-black',
                )}
            >
                <span>{children}</span>
            </NavLink>
        </li>
    );
};

export default function GnbMenu() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
    };

    const handleEnter = (index: number) => {
        clearTimer();
        if (activeIndex !== null) {
            setActiveIndex(index);
        } else {
            // hover intent
            // 이미 열려 있으면 바로 교체
            timerRef.current = setTimeout(() => setActiveIndex(index), 200);
        }
    };

    const handleLeave = () => {
        clearTimer();

        // 49px 빈 공간 통과 허용
        timerRef.current = setTimeout(() => setActiveIndex(null), 400);
    };

    // 메뉴(링크)를 고르면 패널을 닫는다 — 열린 패널이 "준비 중" 안내 모달을 가리지 않게
    const handleClick = (e: React.MouseEvent) => {
        if (!(e.target as Element).closest('a')) return;
        clearTimer();
        setActiveIndex(null);
    };

    // 컴포넌트가 사라질 때 남은 타이머 정리
    useEffect(() => clearTimer, []);

    const activePanel =
        activeIndex !== null ? gnbMenus[activeIndex].panel : undefined;

    return (
        <div
            onMouseEnter={clearTimer}
            onMouseLeave={handleLeave}
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Escape' && setActiveIndex(null)}
        >
            <ul className="mr-[30px] flex items-start gap-[30px]">
                {gnbMenus.map((menu, i) => (
                    <GnbItem
                        key={menu.label}
                        href={menu.href}
                        hasBar={menu.hasBar}
                        isRed={menu.isRed}
                        isActive={activeIndex === i}
                        hasPanel={Boolean(menu.panel)}
                        onEnter={() => handleEnter(i)}
                    >
                        {menu.label}
                    </GnbItem>
                ))}
            </ul>
            {activePanel && <GnbPanel panel={activePanel} />}
        </div>
    );
}
