import type { Metadata } from 'next';
import FindIdView from '@/domains/auth/components/find/FindIdView';

export const metadata: Metadata = {
    title: '아이디 찾기',
};

export default function FindIdPage() {
    return (
        <main className="mx-auto w-full max-w-160 px-4 pt-25 pb-30">
            <FindIdView />
        </main>
    );
}
