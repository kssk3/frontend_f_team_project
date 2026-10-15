'use client'; // next.js가 event를 쓰기 위해 필요

// <main></main> 태그 안 공통 컴파운드 구현

import { useEffect, useState } from 'react';
import { BsArrowUpCircleFill } from 'react-icons/bs';

export default function TopButton() {
    // ArrowUp 버튼 보이기 여부 (true : 보임 / false : 숨기기)
    const [isVisible, setVisible] = useState(false);

    // 스크롤 위치 확인 및 ArrowUp 버튼 보이기 여부 수정
    // const scrollPosition = () => {
    //     if (window.scrollY > 100) {
    //         setVisible(true);
    //     } else {
    //         setVisible(false);
    //     }
    // };

    // useEffect : 스크롤 위치 확인하여 스크롤 동작
    useEffect(() => {
        // 스크롤 이벤트가 왔을 때 콜백 안에서만 호출
        const scrollPosition = () => setVisible(window.scrollY > 0);
        // scrollPosition();

        // scroll을 할때마다 스크롤 위치 확인
        window.addEventListener('scroll', scrollPosition, { passive: true });
        // 해제 클린업 작업
        return () => window.removeEventListener('scroll', scrollPosition);
    }, []);

    // event 적용 : 아이콘을 클릭하면 맨 위로 이동
    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        // 상단 페이지로 이동 - footer위 main화면 오른쪽 하단에 고정
        <button
            type="button"
            id="topScroll"
            onClick={scrollTop}
            // className="fixed right-[30px] bottom-[30px]"
            className={`sticky bottom-[30px] z-[500] mr-[30px] mb-[30px] self-end transition-opacity ${
                isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
            } `}
        >
            <BsArrowUpCircleFill className="text-[40px]" />
        </button>
    );
}
