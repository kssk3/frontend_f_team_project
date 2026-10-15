// 아이콘 불러오기
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표

// 다음 페이지로이동
import Link from 'next/link';

// 장바구니 스텝 컴포넌트 불러오기
import CheckoutStep from '@/domains/checkout/components/CheckoutStep';


// 로그인 상태 변수 (true : 로그인 / false : 비로그인(default))
const isLoggedIn = false ;

export default function EmptyCartPage(): React.JSX.Element {

    // 1) 장바구니 비었을때
    return (
        <main>
            <div className="mt-[60px] mr-[30px] ml-[30px]">

                {/* ① 단계 표시 영역*/}
                <div className='mb-[60px]'>
                    < CheckoutStep currentStep={0}/>
                </div>

                {/* ② 빈 장바구니 영역 */}
                <div className="flex flex-col items-center pt-[100px] pb-[300px]">
                    {/* 안내문구 */}
                    <div className="text-faint pt-[60px] pb-[90px]">
                        <p className="font-medium">
                            장바구니에 담긴 상품이 없습니다.
                        </p>
                    </div>

                    {/* 쇼핑 계속하기 버튼 - main page*/}
                    <Link
                        href="/"  
                        className="flex h-[50px] w-[200px] items-center justify-center rounded border-[1.8px] border-black font-medium"
                    >
                        쇼핑 계속하기
                    </Link>

                    {/* 비로그인시에만 보여주는 페이지 : 로그인 유도 링크 */}
                    {!isLoggedIn && (
                        <Link
                            href="/login"
                            className="mt-[40px]
                            flex items-center
                            font-medium">
                            로그인 후 더 많은 혜택을 받으세요.
                            <GoChevronRight />
                        </Link>
                    )} 
                </div>
            </div>
        </main>
    );
}

