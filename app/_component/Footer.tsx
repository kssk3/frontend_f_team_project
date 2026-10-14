import { Plus } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-muted border-t">
            <div className="inner flex">
                <div className="info text-faint border-muted flex w-1/2 flex-col border-r py-10 pl-[30px] text-sm leading-6">
                    <address className="flex flex-col not-italic">
                        <p className="title mb-5 font-bold text-black">
                            WE ARE ALL EQL.
                        </p>
                        <p>
                            (주) 한섬 / 대표이사 김민덕 / 서울시 강남구 도산대로
                            523 한섬빌딩
                        </p>
                        <p>문의전화 1661-8858 (유료) / 팩스 02-476-8169</p>
                        <p>
                            사업자등록번호 120-81-26337{' '}
                            <a
                                href="https://ftc.go.kr/bizCommPop.do?wrkr_no=1208126337"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <em className="not-italic underline">
                                    사업자 정보 확인
                                </em>
                            </a>
                        </p>
                        <p>
                            통신판매업신고번호 제 2009-서울강남-00826호 /{' '}
                            <a>
                                <em className="not-italic underline">
                                    하나은행 구매안전 서비스
                                </em>
                            </a>
                        </p>
                        <p>
                            개인정보보호 책임자 최원철 / 호스팅 서비스 (주)한섬
                        </p>
                    </address>
                    <p className="footer_privacy mt-5 mb-13 text-[13px] leading-[1.53]">
                        일부 상품의 경우 ㈜한섬은 통신판매의 당사자가 아닌
                        <br />
                        통신판매 중개자로서 상품, 상품정보, 거래에 대한 책임이
                        제한될 수 있으므로,
                        <br />각 상품 페이지에서 구체적인 내용을 확인하시기
                        바랍니다.
                    </p>
                    <p className="copy">
                        COPYRIGHTⓒ 2023 HANDSOME. ALL RIGHTS RESERVED.
                    </p>
                </div>
                <div className="help border-muted flex w-1/4 flex-col justify-between border-r py-10 pl-[30px]">
                    <ul className="text-sm leading-[18px]">
                        <li className="title mb-5 font-bold text-black">
                            고객센터
                        </li>
                        <li className="mb-2.5">
                            <a>FAQ</a>
                        </li>
                        <li className="mb-2.5">
                            <a>공지사항</a>
                        </li>
                        <li className="mb-2.5">
                            <a>매장 안내</a>
                        </li>
                        <li className="mb-2.5">
                            <a>제휴문의</a>
                        </li>
                        <li className="mb-2.5">
                            <a>입점 및 매장 대관 문의</a>
                        </li>
                        <li className="mb-2.5">
                            <a>멤버십 안내</a>
                        </li>
                    </ul>
                    <div className="sns flex gap-[33px] text-sm leading-[18px] font-medium">
                        <a>YOUTUBE</a>
                        <a>FACEBOOK</a>
                        <a>INSTAGRAM</a>
                    </div>
                </div>
                <div className="company flex w-1/4 flex-col justify-between py-10 pl-[30px]">
                    <ul className="text-sm leading-[18px]">
                        <li className="title mb-5 font-bold text-black">
                            회사소개
                        </li>
                        <li className="mb-2.5">
                            <a>ABOUT EQL</a>
                        </li>
                        <li className="mb-2.5">
                            <a>회사소개</a>
                        </li>
                        <li className="mb-2.5">
                            <a>이용약관</a>
                        </li>
                        <li className="mb-2.5">
                            <a className="font-bold text-black underline">
                                개인정보처리방침
                            </a>
                        </li>
                        <li className="mb-2.5">
                            <a>ESG</a>
                        </li>
                    </ul>
                    <button
                        type="button"
                        className="flex items-center gap-[5px] text-sm leading-[18px] font-medium"
                    >
                        FAMILY SITE
                        <Plus className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
