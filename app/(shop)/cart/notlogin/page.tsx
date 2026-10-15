// 아이콘 불러오기
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표

// 다음 페이지로이동
import Link from 'next/link';

// 단계 표시 변수
const CartStep = ['01. CART', '02. ORDER', '03. ORDER COMPLETED'];

export default function NotLoginCartPage(): React.JSX.Element {
    // 현재 단계 (0 : cart(기본) / 1 : 0rder / 2 : order complered)
    const currentStep = 0;

    // 1) 장바구니 비었을때
    return (
        <main>
            <div className="mt-[60px] mr-[30px] ml-[30px]">
                {/* ① 단계 표시 영역*/}
                <ol className="flex gap-3 text-lg font-semibold">
                    {CartStep.map((step, index) => (
                        // 글자와 화살표 높이 맞추기
                        <li key={step} className="flex items-center gap-3">
                            <span
                                className={
                                    currentStep === index
                                        ? 'text-black'
                                        : 'text-faint'
                                }
                            >
                                {step}
                            </span>
                            {/* index가 2보다 작을 때만 아이콘(화살표) 표시 */}
                            {index < 2 && (
                                <GoChevronRight className="text-faint" />
                            )}
                        </li>
                    ))}
                </ol>

                {/* ② 빈 장바구니 영역 */}
                <div className="flex flex-col items-center pt-[100px] pb-[300px]">
                    {/* 안내문구 */}
                    <div className="text-faint pt-[60px] pb-[90px]">
                        <p className="font-medium">
                            장바구니에 담긴 상품이 없습니다.
                        </p>
                    </div>

                    {/* 쇼핑 계속하기 버튼*/}
                    <Link
                        href="/main"
                        className="flex h-[50px] w-[200px] items-center justify-center rounded border-[1.8px] border-black font-medium"
                    >
                        쇼핑 계속하기
                    </Link>

                    {/* 로그인이 되어있지 않을때! 로그인 유도 링크 */}
                    <Link
                        href="/login"
                        className="mt-[40px] flex items-center font-medium"
                    >
                        로그인 후 더 많은 혜택을 받으세요
                        <GoChevronRight />
                    </Link>
                </div>
            </div>
        </main>
    );
}

// 2) 장바구니 채웠을때
