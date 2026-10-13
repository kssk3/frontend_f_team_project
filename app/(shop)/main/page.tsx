import Image from 'next/image';
import testImg from './images/test.jpg';

export default function MainPage(): React.JSX.Element {
    return (
        <>
            <section className="mainSection h-64 w-2xl border bg-amber-600">
                <div className="flex w-max cursor-pointer">
                    <p>메인 페이지</p>
                    <Image src={testImg} alt="test" width={400} />
                </div>
            </section>
        </>
    );
}
