import * as React from 'react';
import { cx } from '../utils/cx';
import type { BadgeTone } from './badge';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  disabled?: boolean;
  onRemove?: () => void;
  /** Name the item when children contain non-text content. */
  removeLabel?: string;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone = 'neutral', disabled = false, onRemove, removeLabel, className, children, ...props },
  ref,
) {
  const text =
    typeof children === 'string' || typeof children === 'number' ? String(children) : 'item';
  return (
    <span
      {...props}
      ref={ref}
      className={cx('tori-chip', `tori-chip--${tone}`, className)}
      aria-disabled={disabled || undefined}
    >
      <span className="tori-chip__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="tori-chip__remove"
          disabled={disabled}
          aria-label={removeLabel ?? `Remove ${text}`}
          onClick={() => onRemove()}
        >
          <svg
            viewBox="0 0 20 20"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      )}
    </span>
  );
});
