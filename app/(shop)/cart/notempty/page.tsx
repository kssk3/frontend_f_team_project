// 아이콘 불러오기
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표
import { IoMdInformationCircleOutline } from "react-icons/io"; // info 표시
import { RxDividerVertical } from "react-icons/rx";
 // | Devider 아이콘

import CheckoutStep from "@/domains/checkout/components/CheckoutStep";

import Link from "next/link";


// 로그인 상태 변수 (true : 로그인, false : 비로그인(default))
const isLoggedIn = false ;

// 장바구니 채워졌을 때 화면
export default function NotEmptyCartPage(): React.JSX.Element {
    return (
        <main>

            <div className="mx-[206px] pt-[100px] pb-[300px]">
                {/* ① 단계 표시 영역 */}
                <div className='mb-[60px]'>
                   < CheckoutStep currentStep={0}/> 
                </div>

                {/* ② 미로그인 시 로그인 유도 영역 */}            
                {!isLoggedIn && (
                    <div className="
                        mb-[60px] p-[30px]
                        border border-black
                        flex justify-between">

                        <Link href="/login">
                            <div className='
                                flex items-center
                                font-medium
                                text-[16px]'>
                                로그인 후 더 많은 혜택을 받으세요
                                < GoChevronRight />
                            </div>
                        </Link>
                        
                            <div className='
                                flex items-center gap-1
                                font-medium
                                text-faint text-[13px]'>
                                <IoMdInformationCircleOutline />
                                로그인을 하시면 장바구니에 담긴 상품을 나중에도 확인하실 수 있습니다.
                            </div>
                    </div>
                )}

                {/* 좌우 구조 나누기 */}
                <div className='flex items-start gap-[70px]'>

                    {/* ③ 왼쪽 화면 - 상품목록*/}
                    <div className='flex-1'>

                        {/* 전체 | 선택 삭제 & 품절 삭제 */}
                        <div className='
                                flex items-center 
                                justify-between 
                                border-b border-black pb-[20px]'> 

                            {/* L왼쪽 - 전체 선택 체크박스 */}
                            <label className='flex items-center gap-2'>
                                <input type='checkbox' />
                                <span>전체</span>
                            </label>

                            {/* L오른쪽 - 삭제버튼 */}
                            <div className='flex items-center justify-center gap-2'>
                                <button type='button'>선택 삭제</button>
                                <RxDividerVertical />
                                <button type='button'>품절 삭제</button>
                            </div>

                        </div>
                    </div>


                    {/* ④ 오른쪽 화면 - 결제정보*/}
                    <div className='
                                w-[470px]
                                border'>

                        <div className='px-[30px] pt-[30px] pb-[90px]'>
                            <div className='font-bold 
                                            border-b border-black 
                                            pb-[20px]'>
                                결제 정보
                            </div>

                            {/* 총 결제금액 */}
                            <dl className='grid grid-cols-2 
                                        gap-y-3 border-b 
                                        mt-[45px] pb-[20px]
                                        text-[16px]'>
                                <dt className='font-bold'>총 결제 금액</dt>
                                <dd className='text-right'>{'data'}원</dd>
                            </dl>

                            {/* 금액 상세 정보 */}
                            <dl className='grid grid-cols-2 gap-y-3 
                                            mt-[15px]
                                            font-semibold text-faint text-[14px]'>
                                <dt>총 상품 금액</dt>
                                <dd className='text-right'>{'data'}원</dd>
                                <dt>총 배송비</dt>
                                <dd className='text-right'>{'data'}원</dd>
                                <dt>총 할인 금액</dt>
                                <dd className='text-right'>{'data'}원</dd>
                            </dl>
                        </div>

                    {/* 하단 : 총 개수와 주문하기 버튼 */}
                    <div>
                        <div className='flex border-t'>
                            <div className='flex flex-1 items-center px-[45px]'>총 {'data'}개</div>
                            <button type='button'
                                    className='h-[90px] w-[300px]
                                    bg-faint
                                    font-bold text-white'>
                                {'data'}원 주문하기
                            </button>
                        </div>
                    </div>

                </div>
                </div>
            </div>
        </main>
    ) ;
} ;