import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from '../components/alert-dialog';

describe('AlertDialog', () => {
  it('uses alertdialog semantics, focuses cancel and ignores outside clicks', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const close = vi.fn();
    const { baseElement } = render(
      <AlertDialog
        open
        title="Delete draft?"
        description="Only this draft will be removed."
        onCancel={onCancel}
        onOpenChange={close}
      />,
    );
    expect(screen.getByRole('alertdialog', { name: 'Delete draft?' })).toHaveAccessibleDescription(
      'Only this draft will be removed.',
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.click(baseElement.querySelector('.tori-dialog-overlay')!);
    expect(close).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('calls confirmation exactly once, closes and restores trigger focus', async () => {
    const user = userEvent.setup();
    const confirm = vi.fn();
    const cancel = vi.fn();
    function Example() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Delete draft</button>
          <AlertDialog
            open={open}
            onOpenChange={setOpen}
            title="Confirm deletion"
            onConfirm={confirm}
            onCancel={cancel}
          />
        </>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Delete draft' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(cancel).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('treats Escape and the cancel button as cancellation, never confirmation', async () => {
    const user = userEvent.setup();
    const confirm = vi.fn();
    const cancel = vi.fn();
    const close = vi.fn();
    render(
      <AlertDialog
        open
        title="Delete?"
        onConfirm={confirm}
        onCancel={cancel}
        onOpenChange={close}
      />,
    );
    await user.keyboard('{Escape}');
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledWith(false);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(cancel).toHaveBeenCalledTimes(2);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('keeps keyboard focus inside and prevents disabled confirmation', async () => {
    const user = userEvent.setup();
    const confirm = vi.fn();
    render(<AlertDialog open title="Delete?" confirmDisabled onConfirm={confirm} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(confirm).not.toHaveBeenCalled();
  });
});
