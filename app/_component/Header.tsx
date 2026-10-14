import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';

type GnbItemProps = {
    href: string;
    children: ReactNode;
    hasArrow?: boolean;
    hasBar?: boolean;
    isRed?: boolean;
};

const barClass =
    'flex items-center gap-[30px] after:block after:h-[10px] after:w-px after:border-r after:border-border';

const redClass = 'text-point';

const menus = [
    { href: '/women', label: 'WOMEN', hasArrow: true },
    { href: '/men', label: 'MEN', hasArrow: true },
    { href: '/life', label: 'LIFE', hasArrow: true, hasBar: true },
    { href: '/brand', label: 'BRAND' },
    { href: '/exclusive', label: 'EQL EXCLUSIVE' },
    { href: '/performance', label: 'PERFORMANCE CLUB' },
    { href: '/outlet', label: 'OUTLET' },
    { href: '/event', label: 'EVENT', isRed: true },
    { href: '/discover', label: 'DISCOVER' },
    { href: '/shop-in-shop', label: 'SHOP IN SHOP', hasBar: true },
    { href: '/curation', label: 'Mid Season Curation + 1', isRed: true },
];

export function GnbItem({
    href,
    children,
    hasArrow = false,
    hasBar = false,
    isRed = false,
}: GnbItemProps) {
    return (
        <li className={cn('group', hasBar && barClass)}>
            <Link
                href={href}
                className={cn(
                    'text-faint flex items-center gap-1 text-xs font-medium',
                    isRed && redClass,
                )}
            >
                <span>{children}</span>
                {hasArrow && (
                    <ChevronDown className="size-[15px] transition-transform group-hover:rotate-180" />
                )}
            </Link>
        </li>
    );
}

export default function Header() {
    return (
        <header className="fixed top-0 left-0 z-[501] flex h-[100px] w-full items-center gap-3 bg-white pr-[26px] pl-[30px]">
            <h1 className="flex h-[100px] items-center">EQL</h1>
            <nav className="h-12 w-full flex-1 justify-between">
                <ul className="mr-[30px] flex h-full items-center gap-[30px]">
                    {menus.map((menu) => (
                        <GnbItem
                            key={menu.label}
                            href={menu.href}
                            hasArrow={menu.hasArrow}
                            hasBar={menu.hasBar}
                            isRed={menu.isRed}
                        >
                            {menu.label}
                        </GnbItem>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
