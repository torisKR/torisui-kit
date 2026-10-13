import * as React from 'react';
import { useControllableState } from '../hooks/use-controllable-state';
import { cx } from '../utils/cx';
import { Field, type FieldOwnProps } from './field';

export interface NumberInputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'type' | 'value' | 'defaultValue' | 'min' | 'max' | 'step' | 'size'
    >,
    FieldOwnProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decreaseLabel?: string;
  increaseLabel?: string;
}

/** Numeric input with bounded increment/decrement buttons. Empty drafts reset on blur. */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      value,
      defaultValue = 0,
      onValueChange,
      min,
      max,
      step = 1,
      label,
      helperText,
      error,
      wrapperClassName,
      className,
      id,
      disabled,
      readOnly,
      decreaseLabel = 'Decrease value',
      increaseLabel = 'Increase value',
      onChange,
      onBlur,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const lower = min != null && Number.isFinite(min) ? min : -Infinity;
    const upper = max != null && Number.isFinite(max) ? Math.max(lower, max) : Infinity;
    const increment = Number.isFinite(step) && step > 0 ? step : 1;
    const clamp = (next: number) =>
      Math.min(
        upper,
        Math.max(lower, Number.isFinite(next) ? next : Number.isFinite(lower) ? lower : 0),
      );
    const [raw, setValue] = useControllableState({ value, defaultValue, onChange: onValueChange });
    const current = clamp(raw);
    const [draft, setDraft] = React.useState(String(current));
    const autoId = React.useId();
    const controlId = id ?? `tori-number-${autoId}`;

    React.useEffect(() => {
      setDraft(String(current));
    }, [current]);

    const changeBy = (direction: number) => {
      const parsed = draft.trim() ? Number(draft) : current;
      const base = Number.isFinite(parsed) ? clamp(parsed) : current;
      const sum = base + increment * direction;
      const rounded = Number(sum.toPrecision(15));
      // Correct decimal addition noise without discarding legitimate integer digits.
      const precise = Math.abs(rounded - sum) <= Number.EPSILON * Math.abs(sum) ? rounded : sum;
      const next = clamp(Number.isFinite(precise) ? precise : base);
      if (next !== current) setValue(next);
      setDraft(String(value === undefined ? next : current));
    };

    const commit = () => {
      const next = draft.trim() ? clamp(Number(draft)) : current;
      if (next !== current) setValue(next);
      setDraft(String(value === undefined ? next : current));
    };

    return (
      <Field
        controlId={controlId}
        label={label}
        helperText={helperText}
        error={error}
        wrapperClassName={wrapperClassName}
      >
        {(a11y) => (
          <div
            className={cx(
              'tori-number-input',
              disabled && 'tori-number-input--disabled',
              className,
            )}
          >
            <button
              type="button"
              className="tori-number-input__button"
              aria-label={decreaseLabel}
              aria-controls={controlId}
              disabled={disabled || readOnly || current <= lower}
              onClick={() => changeBy(-1)}
            >
              −
            </button>
            <input
              {...a11y}
              {...props}
              ref={ref}
              type="number"
              inputMode="decimal"
              className="tori-number-input__control"
              value={draft}
              min={Number.isFinite(lower) ? lower : undefined}
              max={Number.isFinite(upper) ? upper : undefined}
              step={increment}
              disabled={disabled}
              readOnly={readOnly}
              onChange={(event) => {
                onChange?.(event);
                if (event.defaultPrevented) return;
                setDraft(event.target.value);
                const next = event.target.valueAsNumber;
                if (Number.isFinite(next) && next >= lower && next <= upper && next !== current)
                  setValue(next);
              }}
              onBlur={(event) => {
                onBlur?.(event);
                if (!event.defaultPrevented) commit();
              }}
              onKeyDown={(event) => {
                onKeyDown?.(event);
                if (event.defaultPrevented || disabled || readOnly) return;
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  changeBy(event.key === 'ArrowUp' ? 1 : -1);
                } else if (event.key === 'Enter') commit();
              }}
            />
            <button
              type="button"
              className="tori-number-input__button"
              aria-label={increaseLabel}
              aria-controls={controlId}
              disabled={disabled || readOnly || current >= upper}
              onClick={() => changeBy(1)}
            >
              +
            </button>
          </div>
        )}
      </Field>
    );
  },
);
