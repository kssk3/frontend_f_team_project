'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockBanners } from './mockBanners';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import BannerBadge from './BannerBadge';

export default function MainBanner() {
    const [current, setCurrent] = useState(0);

    return (
        <section className="overflow-hidden pb-[calc(var(--badge-drop)_+_35px)] [--badge-drop:62px] md:[--badge-drop:105px] xl:[--badge-drop:120px] 2xl:[--badge-drop:135px]">
            <Swiper
                modules={[Autoplay]}
                loop
                centeredSlides
                slidesPerView={1.922}
                spaceBetween={0}
                speed={300}
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
                className="!overflow-visible"
            >
                {mockBanners.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <Link href={banner.href} className="block">
                            <div className="relative aspect-[1337/827] w-full">
                                <Image
                                    src={banner.image}
                                    alt={banner.alt}
                                    fill
                                    sizes="52vw"
                                    preload={index === 0}
                                    className="object-cover"
                                />
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
                <div slot="container-end">
                    <BannerBadge
                        brand={mockBanners[current].brand}
                        benefit={mockBanners[current].benefit}
                    />
                </div>
            </Swiper>
        </section>
    );
}
