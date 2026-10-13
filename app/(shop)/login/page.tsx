'use client'

import React ,  { useState} from 'react'

import { IoIosSearch, IoMdAdd ,IoIosLogIn, IoIosMenu ,IoIosArchive } from "react-icons/io";


interface UserProfile {
  userName: string;
  userRole: string;
  itemPrice: number;
  itemCount: number;
  isVIP: boolean;
  hasCoupon: boolean;
}


export function SearchBar(): React.JSX.Element {
    const [search, setSearch] = useState("")
    return (
    <div><h2>검색</h2>
        <input 
        type = "text" 
        placeholder = "검색어를 입력해주세요"
        value = {search}
        onChange = {(e) => setSearch(e.target.value)}
        className = "border" />
    </div>
    )
}

export default function LoginPage(): React.JSX.Element {
    const [form, setForm] = useState({id: "", password:""});

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
    

    return <h1>로그인
        <SearchBar />

        <input type = "text" placeholder = "H.Point 아이디를 입력하세요" className ="border"></input>

        <input type = "password" placeholder = "H.Point 비밀번호를 입력하세요 (대/소문자구분)" className ="border"></input>

        <input type = "checkbox" name = "" id= "" ></input>

        <button type= "button" className=""></button>
        
        <button type= "button" className=""></button>

        <button type= "button" className=""></button>

        <button type= "button" className="white"></button>

        </h1>
}

export function Coupon() {

const coupons = [
{ img:"/project/ico_new_coupon_1.png", lines: [{text: "최대 20% 할인쿠폰"} ,{text:"(최대 5만원 할인)", gray: true }]},
{ img:"/project/ico_new_coupon_3.png", lines: [{text: "PB 브랜드 전용"} ,{text:"최대 20% 할인쿠폰"}] },
{ img:"/project/ico_coupon_1.png", lines: [{text: "첫 구매 고객을 위한" , gray: true} ,{text:"무료배송 쿠폰"}]},
{ img:"/project/ico_coupon_5.png", lines: [{text: "생일 바우처 20,000원"} ,{text:"(10만원 이상 결제시)", gray: true }]}
];

    return (

    <section className ='mx-auto max-w-[660px]'>
    
    <p className="bg-gray-50 py-6 text-center font-semibold">
        H.Point 통합 회원으로 EQL 가입하고 다양한 회원 혜택을 받아보세요!</p>

    <ol className="mt-8 grid grid-cols-4 text-center text-sm">
        {coupons.map((c, i) => (
          <li key={i} className="flex flex-col items-center gap-1 py-2">
            <span className="text-base">{String(i + 1).padStart(2, "0")}</span>
            <img src={c.img} alt="" className="my-3 h-12" />
            {c.lines.map((line) => (
              <p key={line.text} className={line.gray ? "text-gray-400" : "font-medium"}>
                {line.text}
              </p>
            ))}
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t border-gray-100 pt-4 text-right text-sm text-gray-400">
        (일부 상품 제외)
      </p></section>);

}

