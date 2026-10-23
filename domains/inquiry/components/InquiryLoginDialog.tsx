// 비로그인 사용자의 「문의하기」 — 바로 보내지 않고 EQL 처럼 확인 모달을 먼저 띄운다
// Dialog 는 레포에 이미 있는 shadcn(base-ui) 컴포넌트를 그대로 쓴다. 상호작용이 있으므로 클라이언트 컴포넌트
'use client';

import Link from 'next/link';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';

export default function InquiryLoginDialog({ productId }: { productId: string }) {
    // 「확인」 → 로그인 뒤 문의 페이지로 돌아오게 redirectUrl 을 붙인다 (s54). 문의 페이지도 같은 검사를 한 번 더 한다
    const loginHref = `/login?redirectUrl=${encodeURIComponent(`/product/${productId}/inquiry`)}`;

    return (
        <Dialog>
            {/* 로그인한 사용자에게 보이는 Link 와 같은 모양 — 눌러도 페이지를 떠나지 않고 모달이 열린다 */}
            <DialogTrigger className="text-sm underline underline-offset-4">문의하기</DialogTrigger>
            <DialogContent className="max-w-sm gap-0 rounded-none p-0 text-center">
                <DialogTitle className="border-b border-neutral-200 py-5 text-lg font-bold">
                    상품 문의
                </DialogTitle>
                <DialogDescription className="px-6 py-12 text-base text-neutral-900">
                    문의는 로그인 후 작성 가능합니다.
                    <br />
                    로그인하시겠습니까?
                </DialogDescription>
                {/* EQL 하단 바 — 취소 / 확인 반반 */}
                <div className="grid grid-cols-2">
                    <DialogClose className="h-14 text-sm font-bold">취소</DialogClose>
                    <Link
                        href={loginHref}
                        className="flex h-14 items-center justify-center bg-neutral-900 text-sm font-bold text-white"
                    >
                        확인
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
