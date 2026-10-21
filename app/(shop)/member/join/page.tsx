import type { Metadata } from 'next';
import JoinIntro from '@/domains/auth/components/signup/JoinIntro';

export const metadata: Metadata = {
    title: '통합 회원가입',
};

// 혜택 안내 → [통합 회원가입] 버튼 → /member/join/form (본인인증부터 시작)
export default function JoinPage() {
    return (
        <main className="mx-auto w-full max-w-160 px-4 pt-25 pb-30">
            <JoinIntro />
        </main>
    );
}
