import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

// 취소 → 확인창의 "확인" → "취소되었습니다." 안내의 "확인"까지 누른다
export async function confirmCancel(user: UserEvent) {
    await user.click(screen.getByRole('button', { name: '취소' }));
    const confirm = await screen.findByRole('dialog', {
        name: '입점 문의 취소',
    });
    await user.click(within(confirm).getByRole('button', { name: '확인' }));
    const notice = await screen.findByRole('dialog', { name: '알림' });
    await user.click(within(notice).getByRole('button', { name: '확인' }));
}
