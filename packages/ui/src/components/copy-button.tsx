import * as React from 'react';
import { cx } from '../utils/cx';
import { Button, type ButtonProps } from './button';

export interface CopyButtonProps extends Omit<ButtonProps, 'asChild' | 'loading'> {
  text: string;
  copyingLabel?: React.ReactNode;
  copiedLabel?: React.ReactNode;
  errorLabel?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
  resetAfter?: number;
  onCopy?: () => void;
  onCopyError?: (error: Error) => void;
}

/** Reports success only after the browser has actually written to the clipboard. */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    text,
    children = 'Copy',
    copyingLabel = 'Copying…',
    copiedLabel = 'Copied',
    errorLabel = 'Copy failed',
    successMessage = 'Copied to clipboard.',
    errorMessage = 'Clipboard unavailable. Select and copy the text manually.',
    resetAfter = 2200,
    onCopy,
    onCopyError,
    disabled,
    onClick,
    variant = 'outline',
    className,
    ...props
  },
  ref,
) {
  const [status, setStatus] = React.useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const requestRef = React.useRef(0);
  const textRef = React.useRef(text);
  textRef.current = text;
  const statusId = React.useId();

  React.useEffect(() => {
    requestRef.current += 1;
    setStatus('idle');
    return () => {
      requestRef.current += 1;
    };
  }, [text]);
  React.useEffect(() => {
    if (status !== 'copied' || resetAfter <= 0) return;
    const timer = window.setTimeout(() => setStatus('idle'), resetAfter);
    return () => window.clearTimeout(timer);
  }, [status, resetAfter]);

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || status === 'copying') return;
    const request = ++requestRef.current;
    const requestedText = text;
    const current = () => requestRef.current === request && textRef.current === requestedText;
    setStatus('copying');
    try {
      if (!window.isSecureContext || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard is unavailable in this browser context.');
      }
      await navigator.clipboard.writeText(requestedText);
    } catch (reason) {
      if (!current()) return;
      setStatus('error');
      onCopyError?.(reason instanceof Error ? reason : new Error(String(reason)));
      return;
    }
    if (!current()) return;
    setStatus('copied');
    onCopy?.();
  }

  return (
    <span className="tori-copy-button">
      <Button
        {...props}
        ref={ref}
        variant={variant}
        className={cx('tori-copy-button__control', className)}
        disabled={disabled || status === 'copying'}
        aria-busy={status === 'copying' || undefined}
        aria-describedby={[props['aria-describedby'], statusId].filter(Boolean).join(' ')}
        data-copy-state={status}
        onClick={copy}
      >
        {status === 'copying'
          ? copyingLabel
          : status === 'copied'
            ? copiedLabel
            : status === 'error'
              ? errorLabel
              : children}
      </Button>
      <span
        id={statusId}
        role="status"
        aria-live="polite"
        className={status === 'error' ? 'tori-copy-button__error' : 'tori-sr-only'}
      >
        {status === 'copied' ? successMessage : status === 'error' ? errorMessage : ''}
      </span>
    </span>
  );
});
