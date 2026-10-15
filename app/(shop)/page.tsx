import { Suspense } from 'react';
import MainBanner from '@/domains/main/MainBanner';

export default function MainPage(): React.JSX.Element {
    return (
        <Suspense
            fallback={
                <div className="mx-auto aspect-[1337/827] w-[52%] bg-neutral-100" />
            }
        >
            <MainBanner />
        </Suspense>
    );
}
