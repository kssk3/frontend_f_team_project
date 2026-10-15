'use client'; // next.js가 event를 쓰기 위해 필요

// <main></main> 태그 안 공통 컴파운드 구현

import { useState } from 'react';
import { BsArrowUpCircleFill } from 'react-icons/bs';

export default function TopButton() {
    // ArrowUp 버튼 보이기 여부 (true : 보임 / false : 숨기기)

    // event 적용 : 아이콘을 클릭하면 맨 위로 이동
    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        // 상단 페이지로 이동 - 화면 오른쪽 아래에 고정
        <button
            type="button"
            id="topScroll"
            onClick={scrollTop}
            className="fixed right-[30px] bottom-[430px]"
        >
            <BsArrowUpCircleFill className="text-10" />
        </button>
    );
}
