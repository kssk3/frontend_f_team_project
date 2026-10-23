import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import OptionChangeModal from './OptionChangeModal';

afterEach(cleanup);

test('the option dialog cannot decrease its initial quantity below one', async () => {
    const user = userEvent.setup();
    render(<OptionChangeModal />);
    await user.click(screen.getByRole('button', { name: '옵션 변경' }));
    const dialog = within(await screen.findByRole('dialog', { name: '옵션 변경' }));
    const decrease = dialog.getByRole('button', { name: '−' }) as HTMLButtonElement;
    await user.dblClick(decrease);
    expect(dialog.getByText('1')).toBeTruthy();
    expect(decrease.disabled).toBe(true);
});

test('increasing enables decrease and returning to one disables it again', async () => {
    const user = userEvent.setup();
    render(<OptionChangeModal />);
    await user.click(screen.getByRole('button', { name: '옵션 변경' }));
    const dialog = within(await screen.findByRole('dialog', { name: '옵션 변경' }));
    const decrease = dialog.getByRole('button', { name: '−' }) as HTMLButtonElement;
    await user.click(dialog.getByRole('button', { name: '+' }));
    expect(dialog.getByText('2')).toBeTruthy();
    expect(decrease.disabled).toBe(false);
    await user.click(decrease);
    expect(dialog.getByText('1')).toBeTruthy();
    expect(decrease.disabled).toBe(true);
    await user.click(decrease);
    expect(dialog.getByText('1')).toBeTruthy();
});
