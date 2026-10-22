// 상품 문의 
// Inquiry Row : DB 가 주는 모양 (snake_case 그대로)
// Inquiry : 화면이 쓰는 모양 (camelCase) , 둘 사이 변환은 inquiry.utils.ts의 toInquiry 한곳에서만 진행

export interface InquiryRow {
    id: string;
    product_id: string;
    is_public: boolean;
    created_at: string; // ISO 문자열 (timestamptz)
    is_answered: boolean;
    writer: string; // 뷰가 마스킹해서 준다 — "홍**"
    content: string | null; // 남의 비밀글이면 뷰가 NULL 로 준다
    answer: string | null;
}

export interface Inquiry {
    id: string;
    isPublic: boolean;
    createdAt: string;
    isAnswered: boolean;
    writer: string;
    content: string | null; // null = 비밀글 (내 것이 아님) → 화면은 자물쇠 줄
    answer: string | null;
}