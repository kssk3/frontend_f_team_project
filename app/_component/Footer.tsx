import NavLink from '@/shared/components/NavLink';
import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

type FooterLink = {
    href: string;
    label: string;
    isStrong?: boolean;
};

const helpLinks: FooterLink[] = [
    { href: '/help/faq', label: 'FAQ' },
    { href: '/help/notice', label: '공지사항' },
    { href: '/help/store', label: '매장 안내' },
    { href: '/help/partnership', label: '제휴문의' },
    { href: '/help/vendor', label: '입점 및 매장 대관 문의' },
    { href: '/help/membership', label: '멤버십 안내' },
];

const companyLinks: FooterLink[] = [
    { href: '/company/about-eql', label: 'ABOUT EQL' },
    { href: '/company/about', label: '회사소개' },
    { href: '/company/terms', label: '이용약관' },
    { href: '/company/privacy', label: '개인정보처리방침', isStrong: true },
    { href: '/company/esg', label: 'ESG' },
];

// href가 없는 항목은 URL 확정 전까지 링크 없이 텍스트로만 표시
const snsLinks: { href?: string; label: string }[] = [
    { label: 'YOUTUBE' },
    { label: 'FACEBOOK' },
    { label: 'INSTAGRAM' },
];

// 학습용 가상 사업자 정보 — 실제 회사 · 인물 · 번호와 무관합니다
// - 회사명은 mock 브랜드(OATLINE)에서 따옴
// - 전화 · 사업자등록번호 · 신고번호는 실존 번호와 겹치지 않도록 형식만 맞추고 0으로 채움
const company = {
    name: '(주)오트라인리테일',
    ceo: '이도윤',
    address: '서울시 성동구 성수이로 77 오트라인빌딩',
    phone: '1600-0000',
    fax: '02-000-0000',
    bizNumber: '000-00-00000',
    mailOrderNumber: '제 2026-서울성동-0000호',
    privacyOfficer: '정하린',
    copyright: 'OATLINE RETAIL',
};

const textLinkClass = 'not-italic underline';

function FooterColumn({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn('flex flex-col py-10 pl-[30px]', className)}>
            {children}
        </div>
    );
}

function FooterLinkList({
    title,
    links,
}: {
    title: string;
    links: FooterLink[];
}) {
    return (
        <ul className="text-sm leading-[18px]">
            <li className="mb-5 font-bold text-black">{title}</li>
            {links.map(({ href, label, isStrong }) => (
                <li key={href} className="mb-2.5">
                    <NavLink href={href}>
                        {isStrong ? (
                            <strong className="underline">{label}</strong>
                        ) : (
                            label
                        )}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}

export default function Footer() {
    return (
        <footer className="border-muted border-t">
            <div className="flex">
                <FooterColumn className="text-faint border-muted w-1/2 border-r text-sm leading-6">
                    <address className="flex flex-col not-italic">
                        <p className="mb-5 font-bold text-black">
                            WE ARE ALL EQL.
                        </p>
                        <p>
                            {company.name} / 대표이사 {company.ceo} /{' '}
                            {company.address}
                        </p>
                        <p>
                            문의전화 {company.phone} (유료) / 팩스 {company.fax}
                        </p>
                        {/* 가상 번호라 공정위 사업자 조회 링크는 연결하지 않음 */}
                        <p>
                            사업자등록번호 {company.bizNumber}{' '}
                            <em className={textLinkClass}>사업자 정보 확인</em>
                        </p>
                        <p>
                            통신판매업신고번호 {company.mailOrderNumber} /{' '}
                            <em className={textLinkClass}>구매안전 서비스</em>
                        </p>
                        <p>
                            개인정보보호 책임자 {company.privacyOfficer} /
                            호스팅 서비스 {company.name}
                        </p>
                    </address>
                    <p className="mt-5 mb-13 text-[13px] leading-[1.53]">
                        일부 상품의 경우 {company.name}은 통신판매의 당사자가
                        아닌
                        <br />
                        통신판매 중개자로서 상품, 상품정보, 거래에 대한 책임이
                        제한될 수 있으므로,
                        <br />각 상품 페이지에서 구체적인 내용을 확인하시기
                        바랍니다.
                    </p>
                    <p>
                        COPYRIGHTⓒ 2026 {company.copyright}. ALL RIGHTS
                        RESERVED.
                    </p>
                </FooterColumn>

                <FooterColumn className="border-muted w-1/4 justify-between border-r">
                    <FooterLinkList title={'고객센터'} links={helpLinks} />
                    <div className="flex gap-[33px] text-sm leading-[18px] font-medium">
                        {snsLinks.map(({ href, label }) =>
                            href ? (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {label}
                                </a>
                            ) : (
                                <span key={label}>{label}</span>
                            ),
                        )}
                    </div>
                </FooterColumn>

                <FooterColumn className="w-1/4 justify-between">
                    <FooterLinkList title={'회사소개'} links={companyLinks} />
                    <button
                        type="button"
                        className="flex items-center gap-[5px] text-sm leading-[18px] font-medium"
                    >
                        FAMILY SITE
                        <Plus className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </FooterColumn>
            </div>
        </footer>
    );
}
