// 담기 버튼 : 회원은 DB(액션), 비회원은 브라우저(zustand)에 담고 /cart로 이동
// 사용 예) <AddToCartForm optionId={picked?.id} quantity={quantity} className="..." />
'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addToCartItem } from '../actions/addToCartItem.actions';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { useCartStore } from '../stores/useCartStore';

interface AddToCartFormProps {
    optionId: string | undefined;  // 고른 옵션 (안 골랐으면 undefined → 버튼 잠금)
    quantity: number;              // 고른 수량
    className?: string;            // 쓰는 쪽(상품 페이지 등)의 버튼 디자인
}

const DEFAULT_CLASS = 'h-12 w-60 bg-black text-white disabled:bg-gray-300';

export default function AddToCartForm({ optionId, quantity, className = DEFAULT_CLASS }: AddToCartFormProps): React.JSX.Element {
    const router = useRouter();
    const addToGuestCart = useCartStore((state) => state.add);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');
    const adding = useRef(false);

    const handleClick = () => {
        if (!optionId || adding.current) return;
        adding.current = true;
        setMessage('');

        startTransition(async () => {
            const formData = new FormData();
            formData.append('optionID', optionId);
            formData.append('quantity', String(quantity));

            try {
                const result = await addToCartItem(INITIAL_ACTION_STATE, formData);
                if (result.success && (result.mode === 'guest' || result.mode === 'member')) {
                    if (result.mode === 'guest') addToGuestCart(optionId, quantity);
                    router.push('/cart');
                    router.refresh();
                } else {
                    setMessage(result.message ?? '장바구니 담기에 실패했습니다.');
                }
            } catch {
                setMessage('장바구니 서비스에 연결하지 못했습니다. 다시 시도해 주세요.');
            } finally {
                adding.current = false;
            }
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={!optionId || isPending}
                className={className}
            >
                {isPending ? '담는 중…' : '장바구니에 담기'}
            </button>
            {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
        </>
    );
}
