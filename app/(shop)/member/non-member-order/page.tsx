import type { Metadata } from 'next';
import GuestOrderLookup from '@/domains/checkout/components/GuestOrderLookup';

export const metadata: Metadata = {
    title: '비회원 주문 조회',
};

export default function NonMemberOrderPage() {
    return (
        <main className="mx-auto w-full max-w-160 px-4 pt-20 pb-30">
            <h1 className="border-b-[3px] border-black pb-7.5 text-center text-[34px] font-bold">
                비회원 주문 조회
            </h1>

            <GuestOrderLookup />

            <section className="mt-17.5">
                <h2 className="mb-4 text-base font-medium">비회원 주문 안내</h2>
                <ul className="space-y-2 text-[13px] text-gray-500">
                    <li>
                        · 비회원의 교환/반품은 고객센터를 통해 접수할 수
                        있습니다.
                    </li>
                    <li>· 주문번호를 잊은 경우 고객센터로 문의해주세요.</li>
                </ul>
                <div className="mt-6 border border-gray-100 bg-gray-50 px-5 py-6">
                    <p className="text-base font-medium">
                        고객센터 1661-8893 (유료)
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        운영시간 : 평일 09:00 ~ 18:00 (토/일/공휴일 휴무)
                    </p>
                </div>
            </section>
        </main>
    );
}
