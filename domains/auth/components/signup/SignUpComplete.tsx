import Link from 'next/link';

export default function SignUpComplete({ name }: { name: string }) {
    return (
        <section className="text-center">
            <p className="text-xl font-bold">
                {name ? `${name}님, ` : ''}회원가입이 완료되었습니다.
            </p>
            <p className="mt-3 text-sm text-gray-500">
                신규 회원 혜택 쿠폰은 마이페이지에서 확인하실 수 있습니다.
            </p>

            <div className="mt-12.5 grid grid-cols-2 gap-2.5">
                <Link
                    href="/"
                    className="flex h-13 items-center justify-center rounded-[3px] border border-black font-medium"
                >
                    쇼핑하러 가기
                </Link>
                <Link
                    href="/login"
                    className="flex h-13 items-center justify-center rounded-[3px] bg-black font-medium text-white"
                >
                    로그인
                </Link>
            </div>
        </section>
    );
}
