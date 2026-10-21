import type { Metadata } from 'next';
import VendorInquiryForm from '@/domains/vendor/components/VendorForm';

export const metadata: Metadata = {
    title: '입점 및 매장 대관 문의',
};

export default function VendorInquiryPage() {
    return (
        <main>
            <div className="mb-[30px] border-b-[3px] border-black pb-[30px]">
                <h1 className="text-[28px] leading-9 font-bold">
                    입점 및 매장 대관 문의
                </h1>
            </div>

            <VendorInquiryForm />
        </main>
    );
}
