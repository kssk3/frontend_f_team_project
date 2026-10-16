import { Suspense } from 'react';
import MainBanner from '@/domains/main/components/MainBanner';
import RecommendSection from '@/domains/main/components/RecommendSection';
import SignupToast from '@/domains/main/components/SignupToast';

// TODO: 로그인 기능이 생기면 실제 로그인 상태로 교체
const isLoggedIn = false;

export default function MainPage(): React.JSX.Element {
    return (
        <Suspense
            fallback={
                <div className="mx-auto aspect-[1337/827] w-[52%] bg-neutral-100" />
            }
        >
            <MainBanner />
            <RecommendSection />
            <SignupToast isLoggedIn={isLoggedIn} />
        </Suspense>
    );
}
