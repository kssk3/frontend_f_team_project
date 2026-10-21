'use client';

import { X } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/shared/components/ui/dialog';

interface AlertModalProps {
    open: boolean;
    message: string;
    title?: string;
    confirmText?: string;
    // 확인 / X / 바깥 클릭 모두 이 함수로 닫힌다
    onClose: () => void;
}

// window.alert() 대신 쓰는 공용 알림 모달
export default function AlertModal({
    open,
    message,
    title = '알림',
    confirmText = '확인',
    onClose,
}: AlertModalProps) {
    return (
        <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
            <DialogContent
                showCloseButton={false}
                className="gap-0 rounded-none p-0 ring-0 sm:max-w-95"
            >
                {/* 상단 바 : 가운데 제목 + 우측 닫기 */}
                <div className="relative flex h-15 items-center justify-center border-b border-gray-200">
                    <DialogTitle className="text-base font-bold">
                        {title}
                    </DialogTitle>
                    <DialogClose aria-label="닫기" className="absolute right-4 p-1">
                        <X size={24} strokeWidth={1.5} />
                    </DialogClose>
                </div>

                <DialogDescription className="px-6 py-10 text-center text-base whitespace-pre-line text-gray-900">
                    {message}
                </DialogDescription>

                <button
                    type="button"
                    onClick={onClose}
                    className="h-14 w-full bg-black font-bold text-white"
                >
                    {confirmText}
                </button>
            </DialogContent>
        </Dialog>
    );
}
