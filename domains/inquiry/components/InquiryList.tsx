// 상품 문의 목록 — 표시 전용. DB 를 묻지 않고 props 만 받는다 (조회는 상세 페이지의 서버 컴포넌트가 한다)
// 클라이언트 컴포넌트인 DetailTabs 의 inquiry 슬롯에 서버에서 그려 넣는다
import Link from 'next/link';
import { FiLock } from 'react-icons/fi';

import { cn } from '@/shared/utils/cn';

import type { Inquiry } from '../types/inquiry.types';
import { formatDate } from '../utils/inquiry.utils';
import InquiryLoginDialog from './InquiryLoginDialog';

interface InquiryListProps {
    productId: string;
    items: Inquiry[];
    canWrite: boolean; // 로그인 여부 — 페이지(서버)가 getUser() 로 알아내 넘긴다
}

export default function InquiryList({ productId, items, canWrite }: InquiryListProps) {
    return (
        <div>
            {/* EQL: "상품 문의 [N]" 제목 + 우측 「문의하기」 */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">상품 문의 [{items.length}]</h2>
                {/* 로그인했으면 바로 문의 페이지, 아니면 "로그인하시겠습니까?" 모달 (EQL 흐름) */}
                {canWrite ? (
                    <Link
                        href={`/product/${productId}/inquiry`}
                        className="text-sm underline underline-offset-4"
                    >
                        문의하기
                    </Link>
                ) : (
                    <InquiryLoginDialog productId={productId} />
                )}
            </div>

            {items.length === 0 ? (
                <p className="py-20 text-center text-sm text-neutral-400">
                    아직 등록된 문의가 없습니다.
                </p>
            ) : (
                <ul className="mt-6 divide-y divide-neutral-200">
                    {items.map((q) => (
                        <li key={q.id} className="py-6">
                            {/* 날짜 | 마스킹된 작성자("홍**") — 둘 다 뷰가 만들어 준 값 */}
                            <p className="text-xs text-neutral-400">
                                {formatDate(q.createdAt)}
                                <span className="mx-2">|</span>
                                {q.writer}
                            </p>
                            <span
                                className={cn(
                                    'mt-3 inline-block px-2 py-0.5 text-xs font-bold',
                                    q.isAnswered
                                        ? 'bg-neutral-900 text-white'
                                        : 'border border-neutral-300 text-neutral-500',
                                )}
                            >
                                {q.isAnswered ? '답변 완료' : '답변 대기'}
                            </span>
                            {/* 자물쇠 — content 가 null 이면 남의 비밀글이다.
                                뷰(product_inquiries_view)가 CASE WHEN is_public OR user_id = auth.uid() 로
                                내 글·공개 글만 내용을 주고, 남의 비밀글은 NULL 로 준다 → 화면은 값이 없으면 자물쇠 줄 */}
                            {q.content === null ? (
                                <p className="mt-3 flex items-center gap-1 text-sm">
                                    <FiLock aria-hidden />
                                    비밀글 입니다.
                                </p>
                            ) : (
                                <p className="mt-3 text-sm whitespace-pre-wrap">{q.content}</p>
                            )}
                            {q.answer && (
                                <div className="mt-4 border-l-2 border-neutral-900 pl-4 text-sm">
                                    <p className="text-xs font-bold">답변</p>
                                    <p className="mt-1 whitespace-pre-wrap">{q.answer}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
