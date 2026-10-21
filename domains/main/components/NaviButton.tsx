'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

type NaviButtonProps = {
    onPrev: () => void;
    onNext: () => void;
    isBeginning: boolean;
    isEnd: boolean;
};

const base =
    'flex size-8 items-center justify-center border border-neutral-300 bg-white ' +
    'cursor-pointer disabled:cursor-default disabled:opacity-35';

export default function NaviButton({
    onPrev,
    onNext,
    isBeginning,
    isEnd,
}: NaviButtonProps) {
    return (
        <div className="flex">
            <button
                type="button"
                aria-label="이전 슬라이드"
                onClick={onPrev}
                disabled={isBeginning}
                className={base}
            >
                <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
                type="button"
                aria-label="다음 슬라이드"
                onClick={onNext}
                disabled={isEnd}
                className={cn(base, '-ml-px')}
            >
                <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
        </div>
    );
}
