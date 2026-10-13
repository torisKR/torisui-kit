import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyButton } from '../components/copy-button';

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
afterEach(() => {
  vi.unstubAllGlobals();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
});
function clipboard(writeText: (text: string) => Promise<void>) {
  vi.stubGlobal('isSecureContext', true);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
}

describe('CopyButton', () => {
  it('announces success only after the actual asynchronous write completes', async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const writeText = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    clipboard(writeText);
    const onCopy = vi.fn();
    render(<CopyButton text="exact text" onCopy={onCopy} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('exact text');
    expect(screen.getByRole('button', { name: 'Copying…' })).toBeDisabled();
    expect(screen.getByRole('status')).not.toHaveTextContent('Copied');
    expect(onCopy).not.toHaveBeenCalled();
    await act(async () => resolve());
    expect(screen.getByRole('button', { name: 'Copied' })).toBeEnabled();
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.');
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('provides an accessible failure instead of success when clipboard is unavailable', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('isSecureContext', false);
    const onCopy = vi.fn();
    const onCopyError = vi.fn();
    render(<CopyButton text="manual copy" onCopy={onCopy} onCopyError={onCopyError} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copy failed' })).toHaveAccessibleDescription(
      'Clipboard unavailable. Select and copy the text manually.',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Clipboard unavailable');
    expect(onCopy).not.toHaveBeenCalled();
    expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('recovers from a rejected write on a subsequent click', async () => {
    const user = userEvent.setup();
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error('Denied'))
      .mockResolvedValueOnce(undefined);
    clipboard(writeText);
    render(<CopyButton text="retry" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Copy failed' }));
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('ignores a pending result after its text changes or the control unmounts', async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    clipboard(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    const onCopy = vi.fn();
    const { rerender, unmount } = render(<CopyButton text="old" onCopy={onCopy} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    rerender(<CopyButton text="new" onCopy={onCopy} />);
    await act(async () => resolve());
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(onCopy).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    unmount();
    await act(async () => resolve());
    expect(onCopy).not.toHaveBeenCalled();
  });

  it('resets feedback and honors a caller preventing the copy action', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    clipboard(writeText);
    const { rerender } = render(<CopyButton text="copy" resetAfter={10} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument());
    writeText.mockClear();
    rerender(<CopyButton text="copy" onClick={(event) => event.preventDefault()} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).not.toHaveBeenCalled();
  });
});
