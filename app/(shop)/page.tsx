import { Suspense } from 'react';
import MainBanner from '@/domains/main/components/MainBanner';
import DiscoverSection from '@/domains/main/components/DiscoverSection';
import DiscoverSkeleton from '@/domains/main/components/DiscoverSkeleton';
import AuthSignupToast from '@/domains/auth/components/AuthSignupToast';

export default function MainPage(): React.JSX.Element {
    return (
        <Suspense
            fallback={
                <div className="mx-auto aspect-[1337/827] w-[52%] bg-neutral-100" />
            }
        >
            <MainBanner />
            {/* DB 상품을 기다리는 동안 배너는 먼저 보이고, 카드는 회색 자리로 잡아 둔다 */}
            <Suspense fallback={<DiscoverSkeleton />}>
                <DiscoverSection />
            </Suspense>
            <Suspense fallback={null}>
                <AuthSignupToast />
            </Suspense>
        </Suspense>
    );
}
