import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';

import AlertModal from './AlertModal';

afterEach(cleanup);

test('onCancel 이 없으면 지금처럼 확인 버튼 하나만 보여준다', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AlertModal open message="취소되었습니다." onClose={onClose} />);

    const dialog = await screen.findByRole('dialog', { name: '알림' });
    expect(within(dialog).queryByRole('button', { name: '취소' })).toBeNull();

    await user.click(within(dialog).getByRole('button', { name: '확인' }));
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('onCancel 을 넘기면 [취소 | 확인] 두 버튼이 되고 각각 맞는 함수를 부른다', async () => {
    const onClose = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
        <AlertModal
            open
            title="입점 문의 취소"
            message="입력된 내용은 저장되지 않습니다. 페이지를 벗어나시겠습니까?"
            onClose={onClose}
            onCancel={onCancel}
        />,
    );

    const dialog = await screen.findByRole('dialog', {
        name: '입점 문의 취소',
    });
    await user.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole('button', { name: '확인' }));
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('onCancel 을 넘기면 X 버튼은 취소로 처리한다', async () => {
    const onClose = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
        <AlertModal
            open
            message="삭제하시겠습니까?"
            onClose={onClose}
            onCancel={onCancel}
        />,
    );

    const dialog = await screen.findByRole('dialog', { name: '알림' });
    await user.click(within(dialog).getByRole('button', { name: '닫기' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
});
