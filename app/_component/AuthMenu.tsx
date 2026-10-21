import type { ReactNode } from 'react';
import { isLoggedIn } from '@/domains/auth/dal';
import SignOutForm from '@/domains/auth/components/SignOutForm';

// 로그인 상태면 로그아웃 버튼, 아니면 loginItem(로그인 아이콘)을 보여 준다.
// 쿠키를 읽으므로 Header 에서 <Suspense> 로 감싸서 사용
export default async function AuthMenu({ loginItem }: { loginItem: ReactNode }) {
    return (await isLoggedIn()) ? <SignOutForm /> : loginItem;
}
