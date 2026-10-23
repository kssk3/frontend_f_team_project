import Image from 'next/image';
import Link from 'next/link';
import NavLink from '@/shared/components/NavLink';
import gnbLogo from './images/gnb_logo.png';
import { Suspense } from 'react';
import GnbMenu from './gnb/GnbMenu';
import AuthMenu from './AuthMenu';
import CartMenu from './CartMenu';
import CartBadge from '@/domains/cart/components/CartBadge';
import {
    Search,
    User,
    LogIn,
    StretchHorizontal,
    ShoppingBag,
    LucideIcon,
} from 'lucide-react';

type UtilItemProps = {
    href: string;
    icon: LucideIcon;
    label?: string;
};

const utilMenus = [
    { href: '/search', label: '검색', Icon: Search },
    { href: '/mypage', label: '마이페이지', Icon: User },
    { href: '/login', label: '로그인', Icon: LogIn },
    { href: '/equal', label: '이퀄', Icon: StretchHorizontal },
    { href: '/cart', label: '장바구니', Icon: ShoppingBag },
];

export function UtilItem({ href, label, icon: Icon }: UtilItemProps) {
    return (
        <li>
            <NavLink
                href={href}
                aria-label={label}
                className="relative block size-7"
            >
                <Icon className="size-7" strokeWidth={1.5} />
            </NavLink>
        </li>
    );
}

export default function Header() {
    return (
        <header className="fixed top-0 left-0 z-[501] flex h-[100px] w-full min-w-[1280px] items-center gap-7.5 bg-white pr-[26px] pl-[30px]">
            <h1 className="flex h-[100px] shrink-0 pt-[30px]">
                <Link href="/">
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
                <GnbMenu />
                <ul className="flex items-start gap-[30px]">
                    {utilMenus.map(({ href, label, Icon }) =>
                        // 로그인 칸만 로그인 상태에 따라 로그인 / 로그아웃으로 바뀐다
                        href === '/login' ? (
                            <Suspense
                                key={href}
                                fallback={<UtilItem href={href} label={label} icon={Icon} />}
                            >
                                <AuthMenu
                                    loginItem={<UtilItem href={href} label={label} icon={Icon} />}
                                />
                            </Suspense>
                        ) : href === '/cart' ? (
                            <Suspense key={href} fallback={<CartBadge actor="loading" />}>
                                <CartMenu />
                            </Suspense>
                        ) : (
                            <UtilItem
                                key={href}
                                href={href}
                                label={label}
                                icon={Icon}
                            />
                        ),
                    )}
                </ul>
            </nav>
        </header>
    );
}
