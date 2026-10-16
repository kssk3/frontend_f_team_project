export const instant = false;

import DetailGallery from '@/domains/products/components/DetailGallery';
import DetailPurchasePanel from '@/domains/products/components/DetailPurchasePanel';
import { getProduct } from '@/domains/products/api/products';
import { Suspense } from 'react';
import Link from "next/link";
import { notFound } from 'next/navigation';
import { FiChevronRight } from "react-icons/fi";


interface ProductDetailPageProps{
    params: Promise<{id: string}>;
}

export default async function ProductDetailPage({params}: ProductDetailPageProps): Promise<React.JSX.Element>{
     const {id} = await params;
     const product = await getProduct(id);
     // 없는 id 면 렌더링 멈추고 404 페이지 노출
     if (!product) notFound();

     return (
        // 모바일 : 최대폭 가운데 정렬, 패딩 바텀 모바일: 112px, 데스크탑: 64px
        <Suspense fallback={<div className="mx-auto aspect-[1337/827] w-[52%] bg-neutral-100" />}>
            <main className="mx-auto w-full max-w-300 px-4 pb-28 md:pb-16">
                <nav
                    aria-label="현재 위치"
                    className="flex items-center gap-1 text-xs text-neutral-500"
                >
                    <Link href="/" className="hover:text-neutral-900">홈</Link>
                    <FiChevronRight className="text-neutral-300" />
                    <Link href="/product" className="hover:text-neutral-900">전체상품</Link>
                    <FiChevronRight className="text-neutral-300" />
                    <span className="font-medium text-neutral-900">{product.name}</span>
                </nav>
            
                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:sticky lg:top-[calc(var(--spacing-header)+1rem)] lg:self-start">
                        <DetailGallery images={[product.image]} alt={product.alt} />
                    </div>
                    <DetailPurchasePanel product={product} />
                </div>
            </main>
        </Suspense>
     );
    }