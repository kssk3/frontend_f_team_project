
import DetailGallery from '@/domains/product/components/DetailGallery';
import DetailPurchasePanel from '@/domains/product/components/DetailPurchasePanel';
import DetailTabs from '@/domains/product/components/DetailTabs';
import { Suspense } from 'react';
import Link from "next/link";
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { FiChevronRight } from "react-icons/fi";
import { createServerClient } from '@/shared/lib/supabase';
import type { ProductRow } from '@/domains/product/types/product.types';
import { toProduct } from '@/domains/product/utils/product.utils';
import InquiryList from '@/domains/inquiry/components/InquiryList';
import type { InquiryRow } from '@/domains/inquiry/types/inquiry.types';
import { toInquiry } from '@/domains/inquiry/utils/inquiry.utils';


interface ProductDetailPageProps{
    params: Promise<{id: string}>;
}

export default function ProductDetailPage({params}: ProductDetailPageProps){
    return (
        <main className="mx-auto w-full max-w-[75rem] px-4 pb-28 md:pb-16">
            <Suspense fallback={<div className="mx-auto aspect-[1337/827] w-[52%] bg-neutral-100" />}>
                <ProductDetail params={params} />
            </Suspense>
        </main>
    );
}

async function ProductDetail({params}: ProductDetailPageProps){
     const {id} = await params;
     // 이 부분은 요청마다 새로 그린다고 알린다 — 없으면 Supabase Auth 내부의 Date.now() 때문에 서버 로그에 prerender 오류 (노트 §6-1)
     await connection();
     const supabase = createServerClient(); // 팀 공용 파일의 서버용 연결 객체 — 동기 함수라 await 없이

     const { data, error } = await supabase
         .from('products')
         .select(
            `id, name, category, base_price, sale_price, discount_price, delivery_type, delivery_fee,
            brands ( name ),
            product_images ( image_url, alt, sort_order ),
            product_options ( id, size, extra_price, stock )`,
         )
         .eq('id', id)
         .is('deleted_at', null)
         .is('product_images.deleted_at', null)
         .is('product_options.deleted_at', null)
         .order('sort_order', { referencedTable: 'product_images' })
         .maybeSingle()
         .overrideTypes<ProductRow, { merge: false }>();
        
         if (error) {
            if (error.code === '22P02') notFound();  // uuid 형식이 아님 (/product/abc) → 404
            throw error;
        }
        if (!data) notFound(); // 형식은 맞는데 없는 id · 판매 종료 → 404
        
        const product = toProduct(data); // 그 밖의 오류(네트워크·권한) → 오류 화면

        // 상품 문의 — 표(product_inquiries)가 아니라 뷰(product_inquiries_view)를 읽는다.
        // 표는 SELECT 권한을 거둬 두었고, 뷰가 비공개 글의 content·answer 를 작성자 본인에게만 주고 남에게는 NULL 로 가린다.
        // 최신순, 상한 없음 — ponytail: 페이지네이션은 문의가 수십 건을 넘을 때
        const { data: inquiryRows, error: inquiryError } = await supabase
            .from('product_inquiries_view')
            .select('id, product_id, is_public, created_at, is_answered, writer, content, answer')
            .eq('product_id', product.id)
            .order('created_at', { ascending: false })
            .overrideTypes<InquiryRow[], { merge: false }>();
        if (inquiryError) throw inquiryError;
        const inquiries = (inquiryRows ?? []).map(toInquiry);
        // 「문의하기」 분기용 — 로그인했으면 Link, 아니면 로그인 확인 모달 (EQL 흐름). 쿠키의 토큰을 Supabase 에 물어 확인한다
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return (
            <>
                <nav aria-label="현재 위치" className="flex items-center gap-1 text-xs text-neutral-500"
                >
                    <Link href="/" className="hover:text-neutral-900">홈</Link>
                    <FiChevronRight className="text-neutral-300" />
                    {/* 분류 이름 - 카테고리 목록페이지가 생기면 링크로 바꿈 */}
                    <span>{product.category}</span>
                    <FiChevronRight className="text-neutral-300" />
                    <span className="font-medium text-neutral-900">{product.name}</span>
                </nav>

                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:sticky lg:top-[calc(var(--spacing-header)+1rem)] lg:self-start">
                        {/* DB 상품은  images 목록(url · alt)을 가짐 */}
                        <DetailGallery images={product.images.map((img) => img.url)} alt={product.name}/>
                    </div>
                    {/* DB 에서 온 Product (패널 import 경로만, 고치는건 파일 밖에서 함 */}
                    <DetailPurchasePanel product={product} />
                </div>

                <DetailTabs
                    description={
                        <div className="py-20 text-center text-sm text-neutral-400">
                            상품 설명이 들어갈 자리입니다.
                        </div>
                    }
                    inquiry={<InquiryList productId={product.id} items={inquiries} canWrite={Boolean(user)} />}
                    inquiryCount={inquiries.length}
                />
            </>
        );
    }
