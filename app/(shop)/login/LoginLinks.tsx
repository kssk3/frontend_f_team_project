import Link from "next/link";
import styles from "./LoginLinks.module.css";

const links = [
  { href: "/member/non-member-order", label: "비회원 주문조회" },
  { href: "/member/find-id", label: "아이디 찾기" },
  { href: "/member/find-pw", label: "비밀번호 찾기" },
];

export default function LoginLinks() {
  return (
    <div className="d-flex justify-content-center align-items-center my-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={styles.item}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}