'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import type { DiscoverItem as DiscoverItemData } from '@/domains/main/types';
import 'swiper/css';
import NaviButton from './NaviButton';
import DiscoverItem from './DiscoverItem';

// 카드 데이터는 밖에서 받는다 — DiscoverSection 이 DB 대표 이미지를 넣어서 넘긴다
export default function RecommendSection({
    items,
}: {
    items: DiscoverItemData[];
}) {
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const [edge, setEdge] = useState({ isBeginning: true, isEnd: false });

    // 슬라이드 움직이면 처음/끝 여부를 다시 읽음
    const syncEdge = (s: SwiperType) =>
        setEdge({ isBeginning: s.isBeginning, isEnd: s.isEnd });

    return (
        <section className="relative pt-[60px] pb-[150px] pl-[30px]">
            <div className="absolute top-0 right-[30px] z-10">
                <NaviButton
                    onPrev={() => swiper?.slidePrev()}
                    onNext={() => swiper?.slideNext()}
                    isBeginning={edge.isBeginning}
                    isEnd={edge.isEnd}
                />
            </div>

            <Swiper
                slidesPerView={4.1}
                spaceBetween={10}
                speed={300}
                onSwiper={(s) => {
                    setSwiper(s);
                    syncEdge(s);
                }}
                onSlideChange={syncEdge}
                onResize={syncEdge}
            >
                {items.map((item, index) => (
                    <SwiperSlide key={item.productId}>
                        <DiscoverItem item={item} eager={index < 5} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
