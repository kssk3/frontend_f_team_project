'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { mockDiscover } from '@/domains/main/data/mockDiscover';
import 'swiper/css';
import NaviButton from './NaviButton';
import DiscoverItem from './DiscoverItem';

export default function RecommendSection() {
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
                {mockDiscover.map((item) => (
                    <SwiperSlide key={item.id}>
                        <DiscoverItem item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
