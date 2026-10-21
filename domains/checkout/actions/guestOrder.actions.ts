'use server';

import { ActionState } from '@/shared/types/action.types';

export interface GuestOrder {
    orderNo: string;
    orderedAt: string;
    status: string;
    items: { name: string; option: string; quantity: number; price: number }[];
}

// TODO: 주문 테이블이 생기면 Supabase 조회로 교체
const MOCK_ORDERS: (GuestOrder & { ordererName: string; phone: string })[] = [
    {
        orderNo: 'OD202610200000001',
        ordererName: '홍길동',
        phone: '01012345678',
        orderedAt: '2026-10-20',
        status: '배송중',
        items: [
            {
                name: '울 블렌드 싱글 코트',
                option: 'BLACK / M',
                quantity: 1,
                price: 289000,
            },
            {
                name: '캐시미어 머플러',
                option: 'GREY / FREE',
                quantity: 1,
                price: 89000,
            },
        ],
    },
];

const ORDER_NO_REGEX = /^OD\d{15}$/;

export async function findGuestOrderAction(
    prevState: ActionState<GuestOrder>,
    formData: FormData,
): Promise<ActionState<GuestOrder>> {
    const name = String(formData.get('name') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const orderNo = String(formData.get('orderNo') ?? '')
        .trim()
        .toUpperCase();

    const errors: Record<string, string> = {};
    if (!name) errors.name = '이름을 입력해주세요.';
    if (!/^01\d{8,9}$/.test(phone))
        errors.phone = '휴대폰 번호를 숫자만 입력해주세요.';
    if (!ORDER_NO_REGEX.test(orderNo))
        errors.orderNo = 'OD로 시작하는 17자리 주문번호를 입력해주세요.';
    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    const found = MOCK_ORDERS.find(
        (o) =>
            o.ordererName === name &&
            o.phone === phone &&
            o.orderNo === orderNo,
    );
    if (!found) {
        return {
            success: false,
            message: '입력하신 정보와 일치하는 주문이 없습니다.',
        };
    }

    // 주문자 정보는 응답에서 제외
    const { orderNo: no, orderedAt, status, items } = found;
    return { success: true, data: { orderNo: no, orderedAt, status, items } };
}
