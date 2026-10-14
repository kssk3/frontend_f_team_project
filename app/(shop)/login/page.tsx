'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
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
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(true);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: 로그인 API 호출
    };

    return (
        <main className={`mx-auto w-full ${styles.wrap}`}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={`mb-5 ${styles.input}`}
                    placeholder={`${BRAND} 아이디 입력`}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="password"
                    className={styles.input}
                    placeholder={`${BRAND} 비밀번호 입력 (대/소문자 구분)`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="my-3 flex items-center gap-2">
                    <input
                        id="saveId"
                        type="checkbox"
                        className="size-5 accent-black"
                        checked={saveId}
                        onChange={(e) => setSaveId(e.target.checked)}
                    />
                    <label htmlFor="saveId" className="text-sm">
                        아이디 저장
                    </label>
                </div>

                <button
                    type="submit"
                    className={`w-full ${styles.btnBlack}`}
                >
                    {BRAND} 통합 회원 로그인
                </button>
            </form>

            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <div>
                    <button
                        type="button"
                        className={`w-full ${styles.btnBlack}`}
                    >
                        <SiNaver className="me-2" size={14} />
                        네이버 로그인
                    </button>
                </div>
                <div>
                    <button
                        type="button"
                        className={`w-full ${styles.btnBlack}`}
                    >
                        <RiKakaoTalkFill className="me-2" size={18} />
                        카카오 로그인
                    </button>
                </div>
            </div>

            <LoginLinks />

            {/* reCAPTCHA를 붙인다면 이 위치에 */}

            <Link
                href="/member/join"
                className={`w-full ${styles.btnOutline}`}
            >
                통합 회원가입
            </Link>

            <section className="mt-15">
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
                            <div className="mt-3">
                                {b.title}
                            </div>
                            <div className="text-gray-500">{b.sub}</div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
