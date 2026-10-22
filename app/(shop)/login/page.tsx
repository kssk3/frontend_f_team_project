import Link from 'next/link';
import { Suspense } from 'react';
import SignInForm from '@/domains/auth/components/SignInForm';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import {
    KAKAO_LOGIN_URL,
    NAVER_LOGIN_URL,
} from '@/domains/auth/lib/socialLogin';
import LoginLinks from './LoginLinks';
import styles from './login.module.css';

const BRAND = 'MYSHOP';
const benefits = [
    {
        no: '01',
        ticket: '20%',
        stack: true,
        title: '최대 20% 할인쿠폰',
        sub: '(최대 5만원 할인)',
    },
    {
        no: '02',
        ticket: 'PB',
        stack: false,
        title: 'PB 브랜드 전용',
        sub: '20% 할인쿠폰',
    },
    {
        no: '03',
        ticket: '무료배송',
        stack: false,
        title: '첫 구매 고객을 위한',
        sub: '무료배송 쿠폰',
    },
    {
        no: '04',
        ticket: '20,000',
        stack: false,
        title: '생일 바우처 20,000원',
        sub: '(10만원 이상 결제시)',
    },
];

export default function LoginPage() {
    return (
        <main className={`mx-auto w-full ${styles.wrap}`}>
            <div className="mb-10 text-center">
                <h1 className="text-[34px] font-bold">로그인</h1>
                <p className="mt-3 text-sm">
                    {BRAND}이 처음이시라면 최대{' '}
                    <span className="text-red-600">20%</span> 쿠폰 혜택을
                    드립니다.{' '}
                    <a
                        href="#benefits"
                        className="text-gray-500 underline underline-offset-2"
                    >
                        자세히
                    </a>
                </p>
            </div>

            <Suspense
                fallback={<p role="status">로그인 화면을 준비하고 있습니다.</p>}
            >
                <SignInForm />
            </Suspense>

            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <a
                    href={NAVER_LOGIN_URL}
                    className={`w-full ${styles.btnBlack}`}
                >
                    <SiNaver className="me-2" size={14} />
                    네이버 로그인
                </a>
                <a
                    href={KAKAO_LOGIN_URL}
                    className={`w-full ${styles.btnBlack}`}
                >
                    <RiKakaoTalkFill className="me-2" size={18} />
                    카카오 로그인
                </a>
            </div>

            <LoginLinks />

            <Link href="/member/join" className={`w-full ${styles.btnOutline}`}>
                통합 회원가입
            </Link>

            <section id="benefits" className="mt-15 scroll-mt-5">
                <p className={styles.benefitTitle}>
                    {BRAND} 통합 회원으로 가입하고 다양한 회원 혜택을
                    받아보세요!
                </p>

                <div className="grid grid-cols-2 pt-7.5 text-center md:grid-cols-4">
                    {benefits.map((b) => (
                        <div key={b.no} className="mb-4 text-[13px]">
                            <div className="mb-2">{b.no}</div>
                            <span
                                className={`${styles.ticket} ${b.stack ? styles.stack : ''}`}
                            >
                                {b.ticket}
                            </span>
                            <div className="mt-3">{b.title}</div>
                            <div className="text-gray-500">{b.sub}</div>
                        </div>
                    ))}
                </div>

                <p className="mt-4 border-t border-gray-100 pt-5 text-right text-[13px] text-gray-500">
                    (일부 상품 제외)
                </p>
            </section>
        </main>
    );
}
