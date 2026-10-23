// 장바구니가 비었을 때 화면

import Link from 'next/link';
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표

import CheckoutStep from './CheckoutStep';

export default function EmptyCart({ isLoggedIn }: { isLoggedIn: boolean }): React.JSX.Element {
    return (
        <main>
            <div className="mt-[60px] mr-[30px] ml-[30px]">
                {/* ① 단계 표시 영역 */}
                <div className="mb-[60px]">
                    <CheckoutStep currentStep={0} />
                </div>

                {/* ② 빈 장바구니 영역 */}
                <div className="flex flex-col items-center pt-[100px] pb-[300px]">
                    <div className="text-faint pt-[60px] pb-[90px]">
                        <p className="font-medium">장바구니에 담긴 상품이 없습니다.</p>
                    </div>

                    {/* 쇼핑 계속하기 버튼 - 메인 페이지 */}
                    <Link
                        href="/"
                        className="flex h-[50px] w-[200px] items-center justify-center rounded border-[1.8px] border-black font-medium"
                    >
                        쇼핑 계속하기
                    </Link>

                    {/* 비로그인 시에만 : 로그인 유도 링크 */}
                    {!isLoggedIn && (
                        <Link href="/login?redirectUrl=/cart" className="mt-[40px] flex items-center font-medium">
                            로그인 후 더 많은 혜택을 받으세요.
                            <GoChevronRight />
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
