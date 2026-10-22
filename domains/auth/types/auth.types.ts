// public.users 테이블 한 행 (email/비밀번호는 Supabase Auth가 보관)
export interface UserProfile {
    id: string;
    name: string;
    phone: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface SignInInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}
// 본인인증(목업) 결과: 회원가입 2단계로 넘겨준다
export interface VerifiedIdentity {
    method: 'phone' | 'naver' | 'kakao';
    name: string;
    birth: string; // YYYYMMDD
    phone: string;
}
