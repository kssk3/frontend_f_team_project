import Image from 'next/image';
import NavLink from '@/shared/components/NavLink';
import { ChevronRight } from 'lucide-react';
import type {
    GnbBanner,
    GnbColumn,
    GnbLink,
    GnbPanel as GnbPanelData,
} from './gnbMenus';

const DepthOneLink = ({ link }: { link: GnbLink }) => {
    return (
        <NavLink
            href={link.href}
            className="flex h-7 items-center gap-1 text-sm font-bold text-black"
        >
            {link.label}
            <ChevronRight className="size-3" strokeWidth={2.5} aria-hidden />
        </NavLink>
    );
};

// Column은 JSX의 예약어이기때문에 Kolumn으로 네이밍 함
const Kolumn = ({ column }: { column: GnbColumn }) => {
    return (
        <div className="w-[160px]">
            <DepthOneLink link={column.title} />
            {/* 2단계: 위 14px / 500/ #999 줄 간격 28px */}
            <ul className="mt-[14px]">
                {column.items.map((item) => (
                    <li key={item.href}>
                        <NavLink
                            href={item.href}
                            className="block text-sm leading-7 font-medium text-[#999]"
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Banner = ({ banner }: { banner: GnbBanner }) => {
    return (
        <li className="h-[325px] w-[380px] shrink-0">
            <NavLink href={banner.href} className="block">
                <div className="relative aspect-[380/251] overflow-hidden bg-[#f2f2f2]">
                    <Image
                        src={banner.image}
                        alt={banner.alt}
                        fill
                        sizes="380px"
                        className="object-cover"
                    />
                </div>
                <p className="mt-5 text-base leading-6 font-medium text-black">
                    {banner.title}
                </p>
            </NavLink>
        </li>
    );
};
export default function GnbPanel({ panel }: { panel: GnbPanelData }) {
    return (
        // 헤더(fixed)기준: 위 100px 전체 폭 좌우 30px 아래 75px 아래쪽에만 옅은 그림자
        <div className="absolute top-[100px] left-0 z-[1] w-full bg-white px-[30px] pb-[75px] shadow-[0_30px_60px_-60px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between">
                {/* 왼쪽: 카테고리 영역 (위 20px 열 간격 30px) */}
                <div className="flex w-[1050px] shrink-0 gap-[30px] pt-5">
                    {/* 첫 열: 빠른 링크 / 폭 100px 링크 간격 42px */}
                    <ul className="flex w-[100px] flex-col gap-[14px]">
                        {panel.quick.map((link) => (
                            <li key={link.href}>
                                <DepthOneLink link={link} />
                            </li>
                        ))}
                    </ul>
                    {panel.columns.map((column) => (
                        <Kolumn key={column.title.href} column={column} />
                    ))}
                </div>
                <ul className="hidden h-[355px] min-w-0 flex-wrap justify-end gap-x-[10px] overflow-hidden pt-[30px] min-[1501px]:flex">
                    {panel.banners.map((banner) => (
                        <Banner key={banner.href} banner={banner} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
