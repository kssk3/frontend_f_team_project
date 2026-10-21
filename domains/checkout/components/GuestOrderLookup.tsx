'use client';

import { useActionState } from 'react';
import { ActionState } from '@/shared/types/action.types';
import useFormState from '@/shared/hooks/useFormState';
import { cn } from '@/shared/lib/cn';
import {
    findGuestOrderAction,
    GuestOrder,
} from '../actions/guestOrder.actions';

const INITIAL_STATE: ActionState<GuestOrder> = { success: false };

const FIELDS = [
    {
        label: '주문자명',
        name: 'name',
        placeholder: '이름 입력',
        maxLength: 20,
    },
    {
        label: '휴대폰 번호',
        name: 'phone',
        placeholder: "'-' 없이 숫자만 입력",
        maxLength: 11,
    },
    {
        label: '주문번호',
        name: 'orderNo',
        placeholder: 'OD로 시작하는 17자리 주문번호 입력',
        maxLength: 17,
    },
] as const;

export default function GuestOrderLookup() {
    const [form, onChange] = useFormState({ name: '', phone: '', orderNo: '' });
    const [state, formAction, isPending] = useActionState(
        findGuestOrderAction,
        INITIAL_STATE,
    );
    const order = state.success ? state.data : undefined;

    return (
        <>
            <form action={formAction} noValidate className="pt-7.5">
                {FIELDS.map((f) => {
                    const error = state.errors?.[f.name];
                    return (
                        <div key={f.name} className="mb-7.5 flex">
                            <label
                                htmlFor={f.name}
                                className="w-35 shrink-0 pt-3.5 text-sm"
                            >
                                {f.label}
                            </label>
                            <div className="flex-1">
                                <input
                                    id={f.name}
                                    name={f.name}
                                    placeholder={f.placeholder}
                                    maxLength={f.maxLength}
                                    inputMode={
                                        f.name === 'phone'
                                            ? 'numeric'
                                            : undefined
                                    }
                                    value={form[f.name]}
                                    onChange={onChange}
                                    className={cn(
                                        'h-12 w-full rounded-[3px] border px-3.5 text-sm focus:border-black focus:outline-none',
                                        error
                                            ? 'border-red-500'
                                            : 'border-gray-300',
                                    )}
                                />
                                {error && (
                                    <p className="mt-2 text-sm">{error}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {state.message && !state.success && (
                    <p
                        role="alert"
                        className="mb-4 text-center text-sm text-red-600"
                    >
                        {state.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="h-13 w-full rounded-[3px] bg-black font-medium text-white disabled:opacity-60"
                >
                    {isPending ? '조회 중...' : '주문/배송 조회'}
                </button>
            </form>

            {order && (
                <section className="mt-12.5 border-t-2 border-black">
                    <div className="flex items-center justify-between border-b border-gray-200 py-4 text-sm">
                        <span>
                            주문번호 <b className="ms-1">{order.orderNo}</b>
                        </span>
                        <span className="text-gray-500">{order.orderedAt}</span>
                    </div>
                    <ul>
                        {order.items.map((item) => (
                            <li
                                key={item.name}
                                className="flex items-center justify-between border-b border-gray-100 py-4 text-sm"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="mt-1 text-[13px] text-gray-500">
                                        {item.option} / {item.quantity}개
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p>{item.price.toLocaleString()}원</p>
                                    <p className="mt-1 text-[13px] font-medium">
                                        {order.status}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}
