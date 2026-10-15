'use client';

import { useState, useEffect, useRef } from 'react';

export default function BannerBadge({
    brand,
    benefit,
}: {
    brand: string;
    benefit: string;
}) {
    const trackRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
        const track = trackRef.current;
        const text = textRef.current;
        if (!track || !text) return;

        // 글자가 칸보다 길면 true
        const check = () => setIsOverflow(text.scrollWidth > track.clientWidth);

        check();

        // 화면 크기가 바뀌면 다시 계산
        const observer = new ResizeObserver(check);
        observer.observe(track);
        return () => observer.disconnect();
    }, [benefit]);

    const box =
        'flex w-full items-center overflow-hidden whitespace-nowrap bg-black text-white ' +
        'h-12 px-5 text-base ' + // 모바일
        'md:h-[75px] md:px-[50px] md:text-2xl ' + // ≥768px  (EQL ≤1280 단계)
        'xl:h-[90px] xl:px-20 xl:text-[30px] ' + // ≥1280px (EQL ≤1535 단계)
        '2xl:h-[105px] 2xl:px-[85px] 2xl:text-[36px]'; // ≥1536px (EQL 최대 단계)
    return (
        <div className="absolute bottom-[calc(var(--badge-drop)*-1)] left-0 z-[3] flex w-[85%] flex-col gap-1.5 md:w-[450px] md:gap-[10px] xl:w-[570px] 2xl:w-[680px]">
            <div className={box}>
                <p className="truncate">{brand}</p>
            </div>
            <div className={box}>
                <div
                    ref={trackRef}
                    className={`flex overflow-hidden ${isOverflow ? '[mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]' : ''}`}
                >
                    <span
                        key={benefit}
                        ref={textRef}
                        className={`shrink-0 ${isOverflow ? 'animate-text-flow motion-reduce:animate-none' : ''}`}
                    >
                        {benefit}
                    </span>
                </div>
            </div>
        </div>
    );
}
