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
    // 확인 버튼 (onCancel 이 없으면 X / 바깥 클릭도 이 함수로 닫힌다)
    onClose: () => void;
    // 넘기면 [취소 | 확인] 두 버튼이 된다. X / 바깥 클릭은 취소로 처리
    cancelText?: string;
    onCancel?: () => void;
}

// window.alert() 대신 쓰는 공용 알림 모달
export default function AlertModal({
    open,
    message,
    title = '알림',
    confirmText = '확인',
    onClose,
    cancelText = '취소',
    onCancel,
}: AlertModalProps) {
    const dismiss = onCancel ?? onClose;

    return (
        <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
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

                <div className="flex">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="border-input h-14 flex-1 border bg-white font-bold"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-14 flex-1 bg-black font-bold text-white"
                    >
                        {confirmText}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
