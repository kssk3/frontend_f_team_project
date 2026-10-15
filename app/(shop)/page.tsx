import { Suspense } from 'react';
import MainBanner from '@/domains/main/components/MainBanner';
import RecommendSection from '@/domains/main/components/RecommendSection';

export default function MainPage(): React.JSX.Element {
    return (
        <Suspense
            fallback={
                <div className="mx-auto aspect-[1337/827] w-[52%] bg-neutral-100" />
            }
        >
            <MainBanner />
            <RecommendSection />
        </Suspense>
    );
}
