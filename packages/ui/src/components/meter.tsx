import * as React from 'react';
import { cx } from '../utils/cx';

export interface MeterProps extends Omit<
  React.MeterHTMLAttributes<HTMLMeterElement>,
  'value' | 'min' | 'max' | 'low' | 'high' | 'optimum'
> {
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  wrapperClassName?: string;
}

/** A static measurement within a known range, using native meter semantics. */
export const Meter = React.forwardRef<HTMLMeterElement, MeterProps>(function Meter(
  {
    value,
    min = 0,
    max = 100,
    low,
    high,
    optimum,
    label,
    showValue = true,
    tone = 'primary',
    id,
    className,
    wrapperClassName,
    ...props
  },
  ref,
) {
  const autoId = React.useId();
  const meterId = id ?? `tori-meter-${autoId}`;
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max) && max > lower ? max : lower + 100;
  const clamp = (next: number) => Math.min(upper, Math.max(lower, next));
  const current = Number.isFinite(value) ? clamp(value) : lower;
  const normalizedLow = low != null && Number.isFinite(low) ? clamp(low) : undefined;
  const normalizedHigh =
    high != null && Number.isFinite(high)
      ? Math.max(normalizedLow ?? lower, clamp(high))
      : undefined;
  const normalizedOptimum =
    optimum != null && Number.isFinite(optimum) ? clamp(optimum) : undefined;
  const percent = ((current - lower) / (upper - lower)) * 100;
  return (
    <div className={cx('tori-meter-field', wrapperClassName)}>
      {(label != null || showValue) && (
        <div className="tori-meter-field__header">
          {label != null && <label htmlFor={meterId}>{label}</label>}
          {showValue && (
            <span className="tori-meter-field__value" aria-hidden="true">
              {current} / {upper}
            </span>
          )}
        </div>
      )}
      <div className={cx('tori-meter-track', `tori-meter-track--${tone}`)} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <meter
        {...props}
        ref={ref}
        id={meterId}
        className={cx('tori-meter', className)}
        value={current}
        min={lower}
        max={upper}
        low={normalizedLow}
        high={normalizedHigh}
        optimum={normalizedOptimum}
      />
    </div>
  );
});
