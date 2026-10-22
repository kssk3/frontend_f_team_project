import Link from 'next/link';

// 없는 주소로 직접 들어오거나(주소창 입력·새 탭) notFound() 가 호출되면 보여 준다.
// 메뉴 클릭은 NavLink 가 먼저 막고 모달로 안내하므로, 여기는 그 밖의 경우를 받는다.
export default function NotFound() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-[30px] py-[120px] text-center">
            <h2 className="text-[22px] font-bold text-black">
                찾을 수 없거나 아직 준비 중인 페이지입니다.
            </h2>
            <p className="text-subtle text-[15px] leading-6">
                주소를 다시 확인하시거나 메인 페이지에서 다른 메뉴를 이용해
                주세요.
            </p>
            <Link
                href="/"
                className="flex h-[52px] w-[148px] items-center justify-center bg-black text-[16px] font-medium text-white"
            >
                메인으로
            </Link>
        </main>
    );
}
