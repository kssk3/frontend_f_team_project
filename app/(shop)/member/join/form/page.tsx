import type { Metadata } from 'next';
import SignUpWizard from '@/domains/auth/components/signup/SignUpWizard';

export const metadata: Metadata = {
    title: '통합 회원가입',
};

export default function JoinFormPage() {
    return (
        <main className="mx-auto w-full max-w-160 px-4 pt-25 pb-30">
            <div className="mb-12.5 text-center">
                <h1 className="text-[34px] font-bold">통합 회원가입</h1>
                <p className="mt-4 text-sm">
                    간편하게 신규 가입하고 다양한 혜택을 누려보세요!
                </p>
            </div>

            <SignUpWizard />
        </main>
    );
}
