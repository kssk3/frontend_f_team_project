import type { Metadata } from 'next';
import ResetPasswordView from '@/domains/auth/components/find/ResetPasswordView';

export const metadata: Metadata = {
    title: '비밀번호 재설정',
};

// 비밀번호 찾기 메일의 링크를 누르면 오는 페이지 (?code=... 포함)
export default function ResetPasswordPage() {
    return (
        <main className="mx-auto w-full max-w-160 px-4 pt-25 pb-30">
            <ResetPasswordView />
        </main>
    );
}
