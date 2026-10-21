import type { Metadata } from 'next';
import FindPasswordView from '@/domains/auth/components/find/FindPasswordView';

export const metadata: Metadata = {
    title: '비밀번호 찾기',
};

export default function FindPasswordPage() {
    return (
        <main className="mx-auto w-full max-w-160 px-4 pt-25 pb-30">
            <FindPasswordView />
        </main>
    );
}
