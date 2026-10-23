// 장바구니 담기 테스트용 페이지 (테스트 후 삭제 · 커밋하지 않기)
// DB product_options 에서 재고가 있는 옵션을 직접 읽어 와 담기 버튼을 만든다
import { Suspense } from 'react';
import { connection } from 'next/server';

import { createServerClient } from '@/shared/lib/supabase';
import AddToCartForm from '@/domains/cart/components/AddToCartForm';

type TestOptionRow = {
    id: string;
    size: string;
    stock: number;
    products: { name: string; brands: { name: string } | null } | null;
};

export default function CartTestPage(): React.JSX.Element {
    return (
        <main className="p-10">
            <h1 className="mb-6 text-[20px] font-bold">장바구니 담기 테스트 (DB 옵션 목록)</h1>
            <Suspense fallback={<p>옵션을 불러오는 중…</p>}>
                <TestOptionList />
            </Suspense>
        </main>
    );
}

async function TestOptionList(): Promise<React.JSX.Element> {
    await connection();
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('product_options')
        .select('id, size, stock, products ( name, brands ( name ) )')
        .gt('stock', 0)
        .is('deleted_at', null)
        .limit(20)
        .overrideTypes<TestOptionRow[], { merge: false }>();

    if (error) return <p className="text-red-600">옵션을 불러오지 못했어요: {error.message}</p>;
    if (data.length === 0) return <p>재고가 있는 옵션이 없어요.</p>;

    return (
        <ul className="flex flex-col gap-6">
            {data.map((option) => (
                <li key={option.id}>
                    <p className="font-medium">
                        {option.products?.brands?.name} · {option.products?.name} · {option.size} (재고 {option.stock})
                    </p>
                    <AddToCartForm optionId={option.id} quantity={1} />
                </li>
            ))}
        </ul>
    );
}
