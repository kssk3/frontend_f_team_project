'use client';

import { useRouter } from 'next/navigation';

export default function CartError({ onRetry }: { onRetry?: () => void }) {
    const router = useRouter();
    return (
        <main className="flex min-h-[600px] flex-col items-center justify-center gap-5">
            <p role="alert">장바구니를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
            <button type="button" onClick={onRetry ?? (() => router.refresh())} className="rounded border px-6 py-3">다시 시도</button>
        </main>
    );
}
