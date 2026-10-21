'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

// 이미지 주소 배열을 받는다. 지금 mock 은 상품당 1장이라 page 가 [product.image] 로 감싸서 넘긴다
interface DetailGalleryProps {
    images: string[];
    alt: string;
}

export default function DetailGallery({ images, alt }: DetailGalleryProps) {
    // 선택된 이미지의 "번호"만 담는다 → 회색 상자에서 실제 이미지로 바뀌어도 그대로
    const [selected, setSelected] = useState(0);

    return (
        <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 md:flex-1">
                {/* 이미지가 0장이면 회색 상자만 남긴다 (images[0] 이 undefined 라 Image 가 깨지는 것을 막는다) */}
                {images.length > 0 && (
                    <Image
                        src={images[selected]}
                        alt={alt}
                        // fill = 부모(relative + aspect-square) 크기에 맞춰 채운다
                        fill
                        // 화면 폭별 표시 크기 힌트 → 브라우저가 알맞은 해상도만 받는다 (lg 이상은 2단의 절반)
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        // object-cover = 비율이 달라도(원본 3:4, 상자 1:1) 빈틈 없이 채우고 넘치는 위아래를 자른다
                        className="object-cover"
                    />
                )}
                <div className="absolute top-3 left-3 flex gap-1">
                    <span className="rounded bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
                        EXCLUSIVE
                    </span>
                </div>
            </div>

            {/* 썸네일은 고를 것이 2장 이상일 때만 보여 준다 */}
            {images.length > 1 && (
                <ul
                    className={cn(
                        'flex shrink-0 gap-2 overflow-x-auto pb-1',
                        'md:w-18 md:flex-col md:overflow-x-visible md:pb-0',
                    )}
                >
                    {images.map((src, i) => (
                        <li key={src}>
                            <button
                                type="button"
                                onClick={() => setSelected(i)}
                                aria-label={`${i + 1}번째 이미지 보기`}
                                aria-current={selected === i}
                                className={cn(
                                    'relative block aspect-square w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100 transition md:w-full',
                                    selected === i
                                        ? 'ring-2 ring-neutral-900'
                                        : 'opacity-60 hover:opacity-100',
                                )}
                            >
                                {/* alt="" = 꾸밈 이미지. 버튼 이름은 위 aria-label 이 맡는다 */}
                                <Image src={src} alt="" fill sizes="72px" className="object-cover" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
