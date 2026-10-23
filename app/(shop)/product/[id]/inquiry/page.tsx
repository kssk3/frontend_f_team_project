// 상품 문의 등록 페이지 — /product/{id}/inquiry
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';

import InquiryForm from '@/domains/inquiry/components/InquiryForm';
import { createServerClient } from '@/shared/lib/supabase';

interface ProductInquiryPageProps {
    params: Promise<{ id: string }>;
}

// 상세 페이지와 같은 구조 — 바깥 껍데기 + Suspense 안의 async 컴포넌트
// cacheComponents 에서는 params · 쿠키 같은 요청 시점 값을 Suspense 안에서만 읽을 수 있다
export default function ProductInquiryPage({ params }: ProductInquiryPageProps) {
    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-10">
            <Suspense fallback={<div className="h-[32rem] bg-neutral-100" />}>
                <InquiryPageBody params={params} />
            </Suspense>
        </main>
    );
}

async function InquiryPageBody({ params }: ProductInquiryPageProps) {
    const { id } = await params;
    await connection(); // 없으면 Supabase Auth 의 Date.now() 가 prerender 오류를 남긴다 (10-19 문서 §6-1)
    const supabase = createServerClient();

    // ① 로그인 확인 — 없으면 로그인 뒤 이 페이지로 돌아오게 redirectUrl 을 붙인다 (s54)
    //    같은 출처의 경로만 넣는다 (열린 리다이렉트 방지) — 여기서는 우리가 만든 경로라 안전
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const returnTo = `/product/${id}/inquiry`;
    if (!user) redirect(`/login?redirectUrl=${encodeURIComponent(returnTo)}`);

    // ② 상품명(제목용)과 회원 휴대폰(표시용)을 함께 묻는다 — 서로 무관하므로 동시에
    const [productResult, userResult] = await Promise.all([
        supabase
            .from('products')
            .select('id, name')
            .eq('id', id)
            .is('deleted_at', null)
            .maybeSingle(),
        // users 본인 줄 읽기 정책이 없으면 null → 번호 칸만 빈다 (등록은 막히지 않는다)
        supabase.from('users').select('phone').eq('id', user.id).maybeSingle(),
    ]);

    if (productResult.error) {
        if (productResult.error.code === '22P02') notFound(); // uuid 형식이 아님
        throw productResult.error;
    }
    if (!productResult.data) notFound(); // 없는 상품 · 판매 종료

    return (
        <>
            <h1 className="border-b border-neutral-200 pb-4 text-center text-xl font-bold">
                상품 문의
            </h1>
            <p className="mt-4 text-sm text-neutral-500">{productResult.data.name}</p>
            <InquiryForm
                productId={productResult.data.id}
                phone={userResult.data?.phone ?? ''}
            />
        </>
    );
}
