// 장바구니(catr)와 주문(order), 주문완료(order completed) 페이지에서 사용 

// 아이콘 불러오기
import React from 'react';
import { GoChevronRight } from 'react-icons/go'; // > 오른쪽 화살표

// 단계 표시 변수
const CartStep = ['01. CART', '02. ORDER', '03. ORDER COMPLETED'];


// currentStep : 강조할 단계 (0 : cart / 1 : order / 2 : order completed)
export default function CheckoutStep(
    {currentStep} : {currentStep : number }
    ): React.JSX.Element {

    return (
        
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
    )

} ; 


