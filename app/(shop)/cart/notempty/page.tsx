// 아이콘 불러오기
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표
import { IoMdInformationCircleOutline } from 'react-icons/io'; // info 표시
import { AiOutlineExclamationCircle } from "react-icons/ai"; // 느낌표
import { RxDividerVertical } from 'react-icons/rx';
// | Devider

// cart 컴포넌트 불러오기
import CheckoutStep from '@/domains/cart/components/CheckoutStep';
import CartProductItem from '@/domains/cart/components/CartProductItem';
import RecommendProductCard from '@/domains/cart/components/RecommendProductCard';

import Link from 'next/link';

// 로그인 상태 변수 (true : 로그인, false : 비로그인(default))
const isLoggedIn = false;

// 장바구니 채워졌을 때 화면
export default function NotEmptyCartPage(): React.JSX.Element {

    // 연습용 가격 변수 - 나중에 지우기
    const productPrice = 100000 ;

    return (
        <main>
            <div className="mx-[206px] pt-[100px] pb-[300px]">
                {/* ① 단계 표시 영역 */}
                <div className="mb-[60px]">
                    <CheckoutStep currentStep={0} />
                </div>

                {/* ② 미로그인 시 로그인 유도 영역 */}
                {!isLoggedIn && (
                    <div className="mb-[60px] flex justify-between border border-black p-[30px]">
                        <Link href="/login">
                            <div className="flex items-center text-[16px] font-medium">
                                로그인 후 더 많은 혜택을 받으세요
                                <GoChevronRight />
                            </div>
                        </Link>

                        <div className="text-faint flex items-center gap-1 text-[13px] font-medium">
                            <IoMdInformationCircleOutline />
                            로그인을 하시면 장바구니에 담긴 상품을 나중에도
                            확인하실 수 있습니다.
                        </div>
                    </div>
                )}

                {/* 좌우 구조 나누기 */}
                <div className="flex items-start gap-[70px]">
                    {/* ③ 왼쪽 화면 - 상품목록*/}
                    <div className="flex-1">
                        {/* 전체 | 선택 삭제 & 품절 삭제 */}
                        <div className="flex items-center justify-between border-b border-black pb-[20px]">
                            {/* L왼쪽 - 전체 선택 체크박스 */}
                            <label className="flex items-center gap-2 font-medium">
                                <input type="checkbox" />
                                <span>전체</span>
                            </label>

                            {/* L오른쪽 - 삭제버튼 */}
                            <div className="flex items-center justify-center gap-2 font-medium">
                                <button type="button">선택 삭제</button>
                                <RxDividerVertical />
                                <button type="button">품절 삭제</button>
                            </div>
                        </div>

                        {/* 반복되는 컴포넌트 - 담긴 상품 */}
                        <section className='border-b border-black'>
                            {/* 배송 타입 + 업체명 */}
                            <h3 className='mt-[30px] 
                            text-[14px] font-semibold'>
                                {'[배송 타입]'} {'업체명'}
                            </h3>

                            <ul className='pt-[20px] pb-[30px] border-b border-secondary'>
                                <CartProductItem />
                            </ul>

                            {/* 그룹 결제 금액 */}
                            <div className='flex iitems-center justify-center gap-1 py-[30px] text-[16px] font-medium'>
                                <span>{'총결제 금액'}원 + </span>
                                <span>배송비{'총배송료'}원 = </span>
                                <span>{'최종 금액'}원</span>

                                {/* 아이콘 툴팁 상자 적용 */}
                                <button type="button" className='group relative'>
                                    <div className='text-faint text-medium'>
                                        <AiOutlineExclamationCircle />
                                    </div>
                                    
                                    <span className="hidden group-hover:block
                                                            group-focus:block
                                                    absolute 
                                                    top-full
                                                    left-1/2 -translate-x-1/2
                                                    mt-2
                                                    whitespace-nowrap 
                                                    rounded border border-black bg-white 
                                                    px-[30px] py-[20px] 
                                                    text-[14px]">

                                        {productPrice >=100000 ? (
                                            <span>[업체배송] 무료배송</span>
                                        ) : (
                                            <span>[업체배송] 100,000원 미만 결제 시 배송비 3,000원</span>
                                        )}
                                    </span>
                                </button>
                            </div>

                        </section>

                        {/* 안내문구 */}
                        <p className='pt-[30px] 
                                      flex items-center gap-1
                                      text-subtle text-[13px]'>
                           <IoMdInformationCircleOutline />
                           판매 종료된 상품은 장바구니에서 자공 삭제됩니다. 
                        </p>

                        {/* 추천 영역 */}
                        <section className='mt-[120px]'>
                            <h2 className='text-[18px] font-bold mb-[20px]'>
                                함께 구매하면 좋은 상품
                            </h2>

                            {/* 추천 상품 목록 */}
                            <ul className='grid grid-cols-4 gap-[15px]'>
                                <RecommendProductCard />
                                <RecommendProductCard />
                                <RecommendProductCard />
                                {/* <li>카드1</li>
                                <li>카드2</li>
                                <li>카드3</li> */}
                            </ul>
                        </section>

                    </div>


                    {/* ④ 오른쪽 화면 - 결제정보*/}
                    <div className="border-t[0.7px] border border-x-[0.7px]">
                        <div className="px-[30px] pt-[30px] pb-[90px]">
                            <div className="border-b border-black pb-[20px] text-[18px] font-bold">
                                결제 정보
                            </div>

                            {/* 총 결제금액 */}
                            <dl className="mt-[45px] grid grid-cols-2 gap-y-3 border-b pb-[20px] text-[16px]">
                                <dt className="font-bold">총 결제 금액</dt>
                                <dd className="text-right">{'총 결제 금액'}원</dd>
                            </dl>

                            {/* 금액 상세 정보 */}
                            <dl className="text-faint mt-[15px] grid grid-cols-2 gap-y-3 text-[14px] font-semibold">
                                <dt>총 상품 금액</dt>
                                <dd className="text-right">{'총 상품 금액'}원</dd>
                                <dt>총 배송비</dt>
                                <dd className="text-right">{'총 배송비'}원</dd>
                                <dt>총 할인 금액</dt>
                                <dd className="text-right">{'총 할인 금액'}원</dd>
                            </dl>
                        </div>

                        {/* 하단 : 총 개수와 주문하기 버튼 */}
                        <div>
                            <div className="flex border-t">
                                <div className="flex flex-1 items-center px-[45px]">
                                    총 {'총갯수'}개
                                </div>
                                <button
                                    type="button"
                                    className="h-[90px] w-[300px] bg-black font-bold text-white"
                                >
                                    {'총금액'}원 주문하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
