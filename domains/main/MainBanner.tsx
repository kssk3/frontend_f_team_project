'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockBanners } from './mockBanners';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function MainBanner() {
    const [current, setCurrent] = useState(0);

    return (
        <section className="overflow-hidden">
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
                            <div className="mt-4">
                                <p className="text-lg font-bold">
                                    {banner.brand}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    {banner.benefit}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <p className="mt-2 text-center text-sm">
                {current + 1} / {mockBanners.length}
            </p>
        </section>
    );
}
