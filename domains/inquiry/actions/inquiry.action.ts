'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createServerClient } from '@/shared/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';

import { validateInquiryInput } from '../utils/inquiry.utils';

// createInquiryAction > 문의 등록 액션 
export async function createInquiryAction(
    _prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    // 검증 여러단계 : 화면에서 막아도 서버에서 한 번 더 (요청, 화면 거치지 않을 때도 보내는 것 배제)
    const { values, errors } = validateInquiryInput(formData);
    if (!values) return { success: false, errors };

    const supabase = createServerClient();

    // 로그인 확인 
    const { data: { user },
    } = await supabase.auth.getUser();
    if(!user) {
        return { success: false, 
            errors: { login: '로그인 후 문의를 남길 수 있습니다.' },
         };

    }

    // user.id 판정에만 활용(auth.uid() 활용하지 않음)
    const { error } = await supabase.from('product_inquiries').insert({
        product_id: values.productId,
        content: values.content,
        notify: values.notify, 
        is_public: values.isPublic,
    });

    if(error) {
        if (error.code === '23503') {
            return { success: false, message: '문의할 수 없는 상품이거나 회원정보가 없습니다.'};
        }
        console.error('[createInquiryAction]', error);
        return {
            success: false,
            message: '문의 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        }
    }
    // 캐시 무효화 > 상품 상세 페이지 리로드
    revalidatePath(`/product/${values.productId}`);
    // 리다이렉트 > 상품 상세 페이지로 이동 (faq 섹션으로 이동)
    redirect(`/product/${values.productId}#faq`);
}

