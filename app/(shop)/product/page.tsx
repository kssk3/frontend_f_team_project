import DetailGallery from '@/domains/products/components/DetailGallery';

import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";


interface ProductDetailPageProps{
    params: Promise<{id: string}>;
}

export default async function ProductDetailPage({params}: ProductDetailPageProps): Promise<React.JSX.Element>{
     const {id} = await params;

     return (
        // 모바일 : 최대폭 가운데 정렬, 패딩 바텀 모바일: 112px, 데스크탑: 64px
        <main className="mx-auto w-full max-w-300 px-4 pb-28 md:pb-16">
            <nav
                aria-label="현재 위치"
                className="flex items-center gap-1 text-xs text-neutral-500"
            >
                <Link href="/" className="hover:text-neutral-900">홈</Link>
                <FiChevronRight className="text-neutral-300" />
                <Link href="/product" className="hover:text-neutral-900">전체상품</Link>
                <FiChevronRight className="text-neutral-300" />
                <span className="font-medium text-neutral-900">상품 상세({id})</span>
            </nav>
        
            <div className="mt-6 lg:sticky lg:top-[calc(var(--spacing-header)+1rem)] lg:self-start">
                <DetailGallery title="상품" count={6} />
            </div>
        </main>
     );
    }