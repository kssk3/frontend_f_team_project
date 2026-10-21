'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, Mail, MessageCircle } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

const helpMenus = [
    { href: '/help/faq', label: 'FAQ' },
    { href: '/help/notice', label: '공지사항' },
    { href: '/help/shop', label: '매장 안내' },
    { href: '/help/affiliate', label: '제휴 문의' },
    { href: '/help/vendor', label: '입점 및 매장 대관 문의' },
    { href: '/help/membership', label: '멤버십 안내' },
];

// 학습용 가상 고객센터 정보 — 푸터(Footer.tsx)의 가상 번호와 맞춤
const csInfo = {
    phone: '1600-0000',
    hours: '평일 09:00 ~ 18:00 (토/일/공휴일 휴무)',
    breakTime: '(Break time 12:00 ~ 13:00)',
};

const csChannelClass =
    'flex size-10 items-center justify-center rounded-full border border-input text-[12px] font-medium';

export default function HelpLnb() {
    const pathname = usePathname();

    return (
        <aside className="w-[240px] shrink-0">
            <h2 className="pb-[60px] text-[28px] leading-[35px] font-medium">
                CS CENTER
            </h2>

            <nav aria-label="고객센터 메뉴">
                <ul>
                    {helpMenus.map((menu) => {
                        const isActive = pathname === menu.href;

                        return (
                            <li
                                key={menu.href}
                                className={cn(
                                    'border-b',
                                    isActive
                                        ? 'border-black'
                                        : 'border-secondary',
                                )}
                            >
                                <Link
                                    href={menu.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className="flex h-[49px] items-center justify-between text-[16px] font-medium"
                                >
                                    {menu.label}
                                    {isActive && (
                                        <Check
                                            aria-hidden
                                            className="size-[15px]"
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="mt-[60px]">
                <p className="flex items-center">
                    <a
                        href={`tel:${csInfo.phone}`}
                        className="text-[22px] font-medium"
                    >
                        {csInfo.phone}
                    </a>
                    <span className="text-subtle ml-[5px] text-[18px] font-medium">
                        (유료)
                    </span>
                </p>
                <p className="mt-[10px] text-[14px] font-medium">
                    {csInfo.hours}
                </p>
                <p className="text-subtle mt-1 text-[13px]">
                    {csInfo.breakTime}
                </p>

                {/* 상담 채널은 아직 연결 전이라 표시만 한다 */}
                <ul aria-label="상담 채널" className="mt-5 flex gap-[10px]">
                    <li className={csChannelClass} aria-label="카카오톡 상담">
                        <MessageCircle
                            aria-hidden
                            className="size-4 fill-black"
                        />
                    </li>
                    <li className={csChannelClass} aria-label="메일 상담">
                        <Mail aria-hidden className="size-4" />
                    </li>
                    <li className={csChannelClass} aria-label="1:1 문의">
                        1:1
                    </li>
                </ul>
            </div>
        </aside>
    );
}
