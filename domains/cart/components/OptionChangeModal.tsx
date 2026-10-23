// 장바구니 - 옵션 변경 팝업
'use client';

import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';

export default function OptionChangeModal(): React.JSX.Element {
    const [quantity, setQuantity] = useState(1);

    return (
        <Dialog>
            {/* 1. 누르면 팝업이 열리는 버튼 */}
            <DialogTrigger className="underline">
                옵션 변경
            </DialogTrigger>

            {/* 2. 팝업 내용 */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>옵션 변경</DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-between">
                    <span className="font-medium">M</span>

                    <div className="flex items-center border">
                        <button
                            type="button"
                            className="w-8 h-8 disabled:opacity-40"
                            disabled={quantity <= 1}
                            onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}
                        >
                            −
                        </button>
                        <span className="w-10 text-center">{quantity}</span>
                        <button type="button" className="w-8 h-8" onClick={() => setQuantity((previous) => previous + 1)}>
                            +
                        </button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
