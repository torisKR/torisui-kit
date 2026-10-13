import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';
import { Field, type FieldOwnProps } from './field';
import type { InputSize } from './input';

export interface SearchInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'>,
    FieldOwnProps {
  value?: string;
  defaultValue?: string;
  size?: InputSize;
  /** Receives typed values and clear-button / Escape updates. */
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  clearLabel?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value,
      defaultValue = '',
      onValueChange,
      onClear,
      clearLabel = 'Clear search',
      size = 'md',
      label,
      helperText,
      error,
      wrapperClassName,
      className,
      id,
      disabled,
      readOnly,
      onChange,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const autoId = React.useId();
    const inputId = id ?? `tori-search-${autoId}`;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [query, setQuery] = useControllableState({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    function clear() {
      if (disabled || readOnly || !query) return;
      setQuery('');
      onClear?.();
      inputRef.current?.focus();
    }

    return (
      <Field
        controlId={inputId}
        label={label}
        helperText={helperText}
        error={error}
        wrapperClassName={wrapperClassName}
      >
        {(a11y) => (
          <div className={cx('tori-search-input', `tori-search-input--${size}`)}>
            <svg
              className="tori-search-input__icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              {...a11y}
              {...props}
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              type="search"
              value={query}
              disabled={disabled}
              readOnly={readOnly}
              className={cx(
                'tori-input',
                `tori-input--${size}`,
                'tori-search-input__control',
                className,
              )}
              onChange={(event) => {
                onChange?.(event);
                if (!event.defaultPrevented) setQuery(event.target.value);
              }}
              onKeyDown={(event) => {
                onKeyDown?.(event);
                if (
                  event.key === 'Escape' &&
                  !event.defaultPrevented &&
                  !event.nativeEvent.isComposing &&
                  event.nativeEvent.keyCode !== 229 &&
                  query &&
                  !disabled &&
                  !readOnly
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  clear();
                }
              }}
            />
            {query && (
              <button
                type="button"
                className="tori-search-input__clear"
                aria-label={clearLabel}
                disabled={disabled || readOnly}
                onMouseDown={(event) => event.preventDefault()}
                onClick={clear}
              >
                <svg
                  viewBox="0 0 20 20"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            )}
          </div>
        )}
      </Field>
    );
  },
);
