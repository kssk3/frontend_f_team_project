'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

import { useOpenComingSoon } from '@/shared/components/ComingSoonProvider';
import { isImplemented } from '@/shared/utils/implementedRoutes';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
    href: string;
};

// 메뉴용 Link. 아직 없는 페이지면 이동하지 않고 "준비 중" 안내를 띄운다.
// 페이지가 생기면 shared/utils/implementedRoutes.ts 목록에 추가하면 자동으로 이동한다.
export default function NavLink({
    href,
    onClick,
    prefetch,
    ...rest
}: NavLinkProps) {
    const openComingSoon = useOpenComingSoon();
    const ready = isImplemented(href);

    return (
        <Link
            href={href}
            // 없는 페이지를 미리 불러오면 404 요청만 쌓이므로 끈다
            prefetch={ready ? prefetch : false}
            onClick={(event) => {
                onClick?.(event);
                if (ready || !openComingSoon) return;
                event.preventDefault();
                openComingSoon();
            }}
            {...rest}
        />
    );
}
