'use client';

import { ShoppingBag } from 'lucide-react';
import NavLink from '@/shared/components/NavLink';
import { useGuestCartItems } from './useGuestCartItems';
import { countCartQuantity } from '../utils/cartItem.utils';

type CartBadgeProps = { actor: 'guest' | 'member' | 'error' | 'loading'; quantity?: number };

export default function CartBadge({ actor, quantity = 0 }: CartBadgeProps) {
    const guest = useGuestCartItems(actor === 'guest');
    const status = actor === 'guest' ? guest.status : actor === 'member' ? 'ready' : actor;
    const count = actor === 'guest' ? countCartQuantity(guest.items) : quantity;
    const label = status === 'ready' ? `장바구니 수량 ${count}개`
        : status === 'error' ? '장바구니 수량 확인 실패' : '장바구니 수량 확인 중';
    return (
        <li className="relative">
            <NavLink href="/cart" aria-label="장바구니" className="relative block size-7">
                <ShoppingBag className="size-7" strokeWidth={1.5} />
                <span aria-label={label} aria-live="polite" className="bg-point/90 absolute -top-[5px] left-[14px] min-w-[19px] rounded-full px-1 text-center text-[9px] leading-[19px] font-medium text-white">
                    {status === 'ready' ? count : status === 'error' ? '?' : '…'}
                </span>
            </NavLink>
            {actor === 'guest' && status === 'error' && (
                <button
                    type="button"
                    aria-label="장바구니 수량 다시 확인"
                    onClick={guest.retry}
                    className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap underline"
                >
                    다시 확인
                </button>
            )}
        </li>
    );
}
