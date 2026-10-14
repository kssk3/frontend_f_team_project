// 상품 페이지의 데이터 정의
export interface CartItem {
    id? : string ;                      // 상품 고유 id
    brandName : string ;                // 브랜드명(제조사)
    sellerName? : string ;              // 판매자명(파는곳) - 판배자 배송에 뜨는 정보
    productName : string ;              // 상품명
    optionName? : string ;              // 옵션명 예) 사이즈, (10/22일 예약배송)
    imageUrl : string ;                 // 상품 이미지
    productOriginalPrice : number ;     // 상품 정가 금액 (1개 기준)
    productTotalPrice : number ;        // 최종 결제 금액 (정가-상품/쿠폰 할인가)
    productSalePrice : number ;         // 상품 할인 금액 (정가-최종결제금액)
    couponPrice? : number ;             // 쿠폰 할인 금액 - 로그인 후 확인 가능
    deliveryFee? : number ;             // 배송비
    deliveryType : '일반배송' | '판매자배송' ; // 배송방식
    quantity : number ;                 // 상품 갯수
    checked : boolean ;                 // 상품 선택 여부

    // 다다익선 할인 규칙 -> 상품 갯수에 따라 달라짐 and  
}


//페이지 컴포넌트 : 상품 페이지 보여줄 화면
export default function CartPage() : React.JSX.Element {

    return (
        <main>
            <h1>장바구니</h1>


        </main>
    )
}