import Image from 'next/image';
import Link from 'next/link';
import gnbLogo from '@/app/_component/images/gnb_logo.png';
// 쿠폰 티켓 모양은 로그인 페이지 혜택 영역과 같은 스타일을 쓴다
import styles from '@/app/(shop)/login/login.module.css';

const BRAND = 'MYSHOP';

// 로그인 페이지 하단 혜택(01~04)과 같은 내용
const benefits = [
    {
        label: '신규 가입 혜택',
        title: '최대 20% 할인쿠폰',
        sub: '(최대 5만원 할인, 일부 상품 제외)',
        ticket: '20%',
        stack: true,
    },
    {
        label: 'PB 브랜드 전용',
        title: '20% 할인쿠폰',
        sub: '(일부 상품 제외)',
        ticket: 'PB',
        stack: false,
    },
    {
        label: '첫 구매 고객을 위한',
        title: '무료배송 쿠폰',
        sub: '',
        ticket: '무료배송',
        stack: false,
    },
    {
        label: '생일 축하 혜택',
        title: '생일 바우처 20,000원',
        sub: '(10만원 이상 결제시)',
        ticket: '20,000',
        stack: false,
    },
];

const notices = [
    `${BRAND}의 모든 서비스를 이용할 수 있는 통합 아이디를 만듭니다.`,
    '휴대폰 본인인증 후 간단한 정보 입력으로 가입이 완료됩니다.',
    '네이버, 카카오 계정으로도 간편하게 가입할 수 있습니다.',
    '회원가입은 만 14세 이상만 가능합니다.',
];

/** 통합 회원가입 1단계 전 혜택 안내 화면 */
export default function JoinIntro() {
    return (
        <>
            <div className="mb-10 flex justify-center">
                <Image src={gnbLogo} alt={BRAND} width={115} height={45} />
            </div>

            <p className="bg-gray-50 px-5 py-5 text-center text-sm break-keep">
                {BRAND} 통합 회원으로 가입하고, 다양한 회원 혜택을 받아보세요.
            </p>

            <ul className="mt-5">
                {benefits.map((b) => (
                    <li
                        key={b.title}
                        className="flex items-center justify-between gap-4 border-gray-100 py-8 not-last:border-b"
                    >
                        <div>
                            <p className="text-sm font-medium">{b.label}</p>
                            <p className="mt-2 text-xl">{b.title}</p>
                            {b.sub && (
                                <p className="mt-2 text-[13px] text-gray-500">
                                    {b.sub}
                                </p>
                            )}
                        </div>
                        <span
                            className={`shrink-0 text-center ${styles.ticket} ${b.stack ? styles.stack : ''}`}
                        >
                            {b.ticket}
                        </span>
                    </li>
                ))}
            </ul>

            <Link
                href="/member/join/form"
                className="mt-5 flex h-13 w-full items-center justify-center rounded-[3px] bg-black font-bold text-white"
            >
                통합 회원가입
            </Link>

            <ul className="mt-15 space-y-2 text-[13px] text-gray-500">
                {notices.map((n) => (
                    <li key={n}>· {n}</li>
                ))}
            </ul>
        </>
    );
}
