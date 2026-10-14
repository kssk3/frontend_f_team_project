'use client';

import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

// 컴포넌트 인터페이스(추후 교체 : count > images)
interface DetailGalleryProps{
    count?: number;
    title: string;
}

export default function DetailGallery({
    count = 6, 
    title,
}: DetailGalleryProps) {
    const [selected, setSelected] = useState(0);
    const indexes = Array.from({ length: count }, (_, i) => i); 

    return (
        <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 md:flex-1">
                <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                    {title} 이미지 {selected + 1}
                </div>
                <div className="absolute top-3 left-3 flex gap-1">
                    <span className="rounded bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
                        EXCLUSIVE
                    </span>
                </div>
            </div>

            <ul
                className={cn(
                    'flex shrink-0 gap-2 overflow-x-auto pb-1',
                    'md:w-18 md:flex-col md:overflow-x-visible md:pb-0',
                )}
            >
                {indexes.map((i) => (
                    <li key={i}>
                        <button
                            type="button"
                            onClick={() => setSelected(i)}
                            aria-current={selected === i}
                            className={cn(
                                'aspect-square w-16 shrink-0 rounded-md bg-neutral-100 text-xs text-neutral-400 transition md:w-full',
                                selected === i
                                    ? 'ring-2 ring-neutral-900'
                                    : 'opacity-60 hover:opacity-100',
                            )}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
