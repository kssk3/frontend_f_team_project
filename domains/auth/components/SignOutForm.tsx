'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import AlertModal from '@/shared/components/ui/AlertModal';
import { logoutAction } from '../actions/logout.actions';

// 헤더 유틸 메뉴용 로그아웃 버튼 (아이콘 모양은 다른 유틸 메뉴와 같게)
export default function SignOutForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [alertMessage, setAlertMessage] = useState('');

    const onLogout = () => {
        startTransition(async () => {
            const res = await logoutAction();
            if (!res.success) {
                setAlertMessage(res.message ?? '로그아웃에 실패했습니다.');
                return;
            }
            // 메인으로 보내고, 서버 컴포넌트(헤더 로그인 상태 등)를 다시 그린다
            router.replace('/');
            router.refresh();
        });
    };

    return (
        <li>
            <button
                type="button"
                onClick={onLogout}
                disabled={pending}
                aria-label="로그아웃"
                className="relative block size-7 disabled:opacity-40"
            >
                <LogOut className="size-7" strokeWidth={1.5} />
            </button>

            <AlertModal
                open={alertMessage !== ''}
                message={alertMessage}
                onClose={() => setAlertMessage('')}
            />
        </li>
    );
}
