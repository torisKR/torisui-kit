import * as React from 'react';
import { useControllableState } from '../hooks/use-controllable-state';
import { cx } from '../utils/cx';

export interface StepperStep {
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}
export interface StepperProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange'
> {
  steps: StepperStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

/** Actionable workflow steps. Value is zero-based; unavailable steps are skipped by keyboard. */
export const Stepper = React.forwardRef<HTMLElement, StepperProps>(function Stepper(
  {
    steps,
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    disabled = false,
    orientation = 'horizontal',
    className,
    onKeyDown,
    'aria-label': ariaLabel = 'Workflow steps',
    ...props
  },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const current = Math.min(
    Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0)),
    Math.max(0, steps.length - 1),
  );
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = steps
    .map((step, index) => (!disabled && !step.disabled ? index : -1))
    .filter((index) => index >= 0);
  const tabstop = enabled.includes(current) ? current : enabled[0];
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cx('tori-stepper', `tori-stepper--${orientation}`, className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || enabled.length === 0) return;
        const keys =
          orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
        if (![...keys, 'Home', 'End'].includes(event.key)) return;
        const index = buttons.current.indexOf(event.target as HTMLButtonElement);
        if (index < 0) return;
        event.preventDefault();
        const position = enabled.indexOf(index);
        const next =
          event.key === 'Home'
            ? enabled[0]
            : event.key === 'End'
              ? enabled[enabled.length - 1]
              : enabled[
                  Math.min(
                    enabled.length - 1,
                    Math.max(0, position + (event.key === keys[0] ? -1 : 1)),
                  )
                ];
        if (next == null) return;
        buttons.current[next]?.focus();
        if (next !== current) setValue(next);
      }}
    >
      <ol className="tori-stepper__list">
        {steps.map((step, index) => (
          <li
            key={index}
            className="tori-stepper__item"
            data-state={index === current ? 'current' : index < current ? 'complete' : 'upcoming'}
          >
            <button
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              className="tori-stepper__button"
              aria-current={index === current ? 'step' : undefined}
              tabIndex={index === tabstop ? 0 : -1}
              disabled={disabled || step.disabled}
              onClick={() => {
                if (index !== current) setValue(index);
              }}
            >
              <span className="tori-stepper__number" aria-hidden="true">
                {index < current ? '✓' : index + 1}
              </span>
              <span className="tori-stepper__text">
                <span>{step.label}</span>
                {step.description && (
                  <span className="tori-stepper__description">{step.description}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
});
