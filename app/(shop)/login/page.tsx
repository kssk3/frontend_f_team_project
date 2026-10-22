'use client';

import {
    startTransition,
    useActionState,
    useRef,
    useState,
    useSyncExternalStore,
    type SubmitEvent,
} from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { login } from '@/domains/auth/actions';
import {
    KAKAO_LOGIN_URL,
    NAVER_LOGIN_URL,
} from '@/domains/auth/lib/socialLogin';
import LoginLinks from './LoginLinks';
import styles from './login.module.css';

const BRAND = 'MYSHOP';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
const SAVED_ID_KEY = 'savedLoginId';

// 저장된 아이디: localStorage는 브라우저에만 있으므로 서버 렌더링 시에는 ''
const subscribeNoop = () => () => {};
const readSavedId = () => {
    try {
        return localStorage.getItem(SAVED_ID_KEY) ?? '';
    } catch {
        return '';
    }
};

declare global {
    interface Window {
        grecaptcha?: {
            ready: (cb: () => void) => void;
            render: (
                container: HTMLElement,
                params: {
                    sitekey: string;
                    size: 'invisible';
                    badge: 'inline';
                    callback: (token: string) => void;
                },
            ) => number;
            execute: (widgetId: number) => void;
            reset: (widgetId: number) => void;
        };
    }
}

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
    const savedId = useSyncExternalStore(subscribeNoop, readSavedId, () => '');
    const [typedId, setUserId] = useState<string | null>(null);
    const userId = typedId ?? savedId;
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(true);
    const [state, formAction, pending] = useActionState(login, undefined);
    const [clientError, setClientError] = useState('');

    const recaptchaRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const tokenResolverRef = useRef<((token: string) => void) | null>(null);

    const renderRecaptcha = () => {
        const { grecaptcha } = window;
        if (!RECAPTCHA_SITE_KEY || !grecaptcha || !recaptchaRef.current) return;
        grecaptcha.ready(() => {
            if (!recaptchaRef.current) return;
            widgetIdRef.current = grecaptcha.render(recaptchaRef.current, {
                sitekey: RECAPTCHA_SITE_KEY,
                size: 'invisible',
                badge: 'inline',
                callback: (token) => tokenResolverRef.current?.(token),
            });
        });
    };

    const getRecaptchaToken = () =>
        new Promise<string>((resolve, reject) => {
            // site key 미설정(로컬 개발 등) 시 reCAPTCHA 건너뜀
            if (!RECAPTCHA_SITE_KEY) {
                resolve('');
                return;
            }
            const { grecaptcha } = window;
            const widgetId = widgetIdRef.current;
            if (!grecaptcha || widgetId === null) {
                reject(new Error('reCAPTCHA가 아직 로드되지 않았습니다.'));
                return;
            }
            tokenResolverRef.current = resolve;
            grecaptcha.execute(widgetId);
        });

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setClientError('');
        let token: string;
        try {
            token = await getRecaptchaToken();
        } catch (err) {
            setClientError((err as Error).message);
            return;
        }
        // 토큰은 1회용이므로 다음 시도를 위해 초기화
        if (widgetIdRef.current !== null) {
            window.grecaptcha?.reset(widgetIdRef.current);
        }

        try {
            if (saveId) localStorage.setItem(SAVED_ID_KEY, userId.trim());
            else localStorage.removeItem(SAVED_ID_KEY);
        } catch {}

        const formData = new FormData();
        formData.set('loginId', userId);
        formData.set('password', password);
        formData.set('recaptchaToken', token);
        startTransition(() => formAction(formData));
    };

    const errorMessage = clientError || state?.message;

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

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={`mb-5 ${styles.input}`}
                    placeholder={`${BRAND} 아이디 입력`}
                    autoComplete="username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="password"
                    className={styles.input}
                    placeholder={`${BRAND} 비밀번호 입력 (대/소문자 구분)`}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {errorMessage && (
                    <p role="alert" className="mt-2 text-sm text-red-600">
                        {errorMessage}
                    </p>
                )}

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
                    disabled={pending}
                    className={`w-full disabled:opacity-60 ${styles.btnBlack}`}
                >
                    {pending ? '로그인 중...' : `${BRAND} 통합 회원 로그인`}
                </button>
            </form>

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

            {RECAPTCHA_SITE_KEY && (
                <Script
                    src="https://www.google.com/recaptcha/api.js?render=explicit"
                    onReady={renderRecaptcha}
                />
            )}
            <div ref={recaptchaRef} className="mb-7.5 flex justify-center" />

            <Link
                href="/member/join"
                className={`w-full ${styles.btnOutline}`}
            >
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
                            <div className="mt-3">
                                {b.title}
                            </div>
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
