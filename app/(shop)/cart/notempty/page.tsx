// 아이콘 불러오기
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표
import { IoMdInformationCircleOutline } from "react-icons/io"; // info 표시


import CheckoutStep from "@/domains/checkout/components/CheckoutStep";

import Link from "next/link";


// 장바구니 채워졌을 때 화면
export default function NotEmptyCartPage(): React.JSX.Element {
    return (
        <main>
            <div className="pt-[100px] pb-[300px]">

                {/* ① 단계 표시 영역 */}
                <div className='mb-[60px]'>
                   < CheckoutStep currentStep={0}/> 
                </div>

                {/* ② 미로그인 시 로그인 유도 영역 */}
                <div className="
                    mb-[60px] p-[30px]
                    border">
                    <Link href="/login"
                        className='flex justify-between'>
                            <div className='
                                flex items-center
                                font-medium
                                text-[16px]'>
                                로그인 후 더 많은 혜택을 받으세요
                                < GoChevronRight />
                            </div>

                            <div className='
                                flex items-center
                                text-faint text-[13px]'>
                                <IoMdInformationCircleOutline />
                                로그인을 하시면 장바구니에 담긴 상품을 나중에도 확인하실 수 있습니다.
                            </div>
                    </Link>
                </div>

                <div>
                    
                    {/* ③ 왼쪽 화면*/}
                    <div>

                    </div>
                    
                    {/* ④ 오른쪽 화면*/}
                    <div>

                    </div>

                </div>

            </div>
        </main>
    ) ;
} ;