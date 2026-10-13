'use client'

import { CgFormatJustify } from "react-icons/cg";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { TbShoppingBagHeart } from "react-icons/tb";
import React, { useState } from "react";
import css from "styled-jsx/css";



export function SearchBar() {
    const [search, setSearch] = useState("")
    return (<h1>검색
        <input type = "text" 
        placeholder = "검색어를 입력해주세요"
        value = {search}/>
    </h1>
    )
}

export default function LoginPage() {
    return <h2>로그인
        <SearchBar />
        <input type = "text" placeholder = "아이디를 입력해주세요"></input>

        <input type = "text" placeholder = "비밀번호를 입력해주세요"></input>

        <button type= "button" className=""></button>
        
        <button type= "button" className=""></button>
        </h2>
}
