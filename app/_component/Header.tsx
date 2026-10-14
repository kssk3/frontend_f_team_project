import Image from 'next/image';
import Link from 'next/link';
import gnbLogo from './images/gnb_logo.png';
import type { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import {
    Search,
    User,
    LogIn,
    StretchHorizontal,
    ShoppingBag,
} from 'lucide-react';

type GnbItemProps = {
    href: string;
    children: ReactNode;
    hasBar?: boolean;
    isRed?: boolean;
};

type UtilItemProps = {
    href: string;
    icon: LucideIcon;
    label?: string;
};

const barClass =
    'flex items-center gap-[30px] after:block after:h-[10px] after:w-px after:border-r after:border-border';

const redClass = 'text-point font-bold';

const menus = [
    { href: '/women', label: 'WOMEN' },
    { href: '/men', label: 'MEN' },
    { href: '/life', label: 'LIFE', hasBar: true },
    { href: '/brand', label: 'BRAND' },
    { href: '/exclusive', label: 'EQL EXCLUSIVE' },
    { href: '/performance', label: 'PERFORMANCE CLUB' },
    { href: '/outlet', label: 'OUTLET' },
    { href: '/event', label: 'EVENT', isRed: true },
    { href: '/discover', label: 'DISCOVER' },
    { href: '/shop-in-shop', label: 'SHOP IN SHOP', hasBar: true },
    { href: '/curation', label: 'Mid Season Curation + 1', isRed: true },
];

const utilMenus = [
    { href: '/search', label: '검색', Icon: Search },
    { href: '/mypage', label: '마이페이지', Icon: User },
    { href: '/login', label: '로그인', Icon: LogIn },
    { href: '/equal', label: '이퀄', Icon: StretchHorizontal },
    { href: '/cart', label: '장바구니', Icon: ShoppingBag },
];

export function GnbItem({
    href,
    children,
    hasBar = false,
    isRed = false,
}: GnbItemProps) {
    return (
        <li className={cn('group', hasBar && barClass)}>
            <Link
                href={href}
                className={cn(
                    'text-faint flex items-center gap-1 text-xs leading-[15px] font-medium',
                    isRed && redClass,
                )}
            >
                <span>{children}</span>
            </Link>
        </li>
    );
}

export function UtilItem({ href, label, icon: Icon }: UtilItemProps) {
    return (
        <li>
            <Link href={href} aria-label={label}>
                <Icon className="size-7" strokeWidth={1.5} />
            </Link>
        </li>
    );
}

export default function Header() {
    return (
        <header className="fixed top-0 left-0 z-[501] flex h-[100px] w-full items-center gap-7.5 bg-white pr-[26px] pl-[30px]">
            <h1 className="flex h-[100px] shrink-0 items-center">
                <Link href="/" className="block">
                    <Image
                        src={gnbLogo}
                        alt="EQL home"
                        loading="eager"
                        width={115}
                        height={45}
                    />
                </Link>
            </h1>
            <nav className="mt-9 flex flex-1 items-start justify-between self-start">
                <ul className="mr-[30px] flex items-start gap-[30px]">
                    {menus.map((menu) => (
                        <GnbItem
                            key={menu.label}
                            href={menu.href}
                            hasBar={menu.hasBar}
                            isRed={menu.isRed}
                        >
                            {menu.label}
                        </GnbItem>
                    ))}
                </ul>
                <ul className="flex items-start gap-[30px]">
                    {utilMenus.map(({ href, label, Icon }) => (
                        <UtilItem
                            key={href}
                            href={href}
                            label={label}
                            icon={Icon}
                        />
                    ))}
                </ul>
            </nav>
        </header>
    );
}
