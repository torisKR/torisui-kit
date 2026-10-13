import * as React from 'react';
import { useControllableState } from '../hooks/use-controllable-state';
import { cx } from '../utils/cx';

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}
export interface SegmentedControlProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
}

/** Single-choice segmented radios with roving focus and automatic keyboard selection. */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      options,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      name,
      orientation = 'horizontal',
      className,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const [value, setValue] = useControllableState({
      value: valueProp,
      defaultValue: defaultValue ?? options.find((option) => !option.disabled)?.value ?? '',
      onChange: onValueChange,
    });
    const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
    const enabled = options
      .map((option, index) => (!disabled && !option.disabled ? index : -1))
      .filter((index) => index >= 0);
    const selectedIndex = options.findIndex((option) => option.value === value);
    const tabstop = enabled.includes(selectedIndex) ? selectedIndex : enabled[0];
    return (
      <div
        {...props}
        ref={ref}
        role="radiogroup"
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        className={cx(
          'tori-segmented-control',
          `tori-segmented-control--${orientation}`,
          className,
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || enabled.length === 0) return;
          const keys =
            orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
          if (![...keys, 'Home', 'End'].includes(event.key)) return;
          const index = itemsRef.current.indexOf(event.target as HTMLButtonElement);
          if (index < 0) return;
          event.preventDefault();
          const position = enabled.indexOf(index);
          const nextIndex =
            event.key === 'Home'
              ? enabled[0]
              : event.key === 'End'
                ? enabled[enabled.length - 1]
                : enabled[
                    (position + (event.key === keys[0] ? -1 : 1) + enabled.length) % enabled.length
                  ];
          if (nextIndex == null) return;
          itemsRef.current[nextIndex]?.focus();
          const next = options[nextIndex]!;
          if (next.value !== value) setValue(next.value);
        }}
      >
        {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={(node) => {
              itemsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            tabIndex={index === tabstop ? 0 : -1}
            disabled={disabled || option.disabled}
            data-state={value === option.value ? 'checked' : 'unchecked'}
            className="tori-segmented-control__item"
            onClick={() => {
              if (option.value !== value) setValue(option.value);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  },
);
