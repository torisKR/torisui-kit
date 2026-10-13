import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Meter } from '../components/meter';

describe('Meter', () => {
  it('uses a labeled native meter for a static measurement', () => {
    render(<Meter label="Storage" value={65} max={100} />);
    const meter = screen.getByRole('meter', { name: 'Storage' }) as HTMLMeterElement;
    expect(meter.tagName).toBe('METER');
    expect(meter.value).toBe(65);
    expect(meter.min).toBe(0);
    expect(meter.max).toBe(100);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  it('clamps measurements to the supplied range', () => {
    const { rerender, container } = render(<Meter label="Score" value={150} min={20} max={100} />);
    expect((screen.getByRole('meter') as HTMLMeterElement).value).toBe(100);
    expect((container.querySelector('.tori-meter-track>span') as HTMLElement).style.width).toBe(
      '100%',
    );
    rerender(<Meter label="Score" value={-10} min={20} max={100} />);
    expect((screen.getByRole('meter') as HTMLMeterElement).value).toBe(20);
  });
  it('normalizes invalid ranges and nonfinite values', () => {
    render(<Meter label="Score" value={NaN} min={Infinity} max={-5} />);
    const meter = screen.getByRole('meter') as HTMLMeterElement;
    expect(meter.min).toBe(0);
    expect(meter.max).toBe(100);
    expect(meter.value).toBe(0);
  });
  it('normalizes optional thresholds and optimum within the range', () => {
    render(<Meter label="Health" value={50} low={80} high={20} optimum={200} />);
    const meter = screen.getByRole('meter') as HTMLMeterElement;
    expect(meter.low).toBe(80);
    expect(meter.high).toBe(80);
    expect(meter.optimum).toBe(100);
  });
  it('can hide the visible value while retaining its accessible semantics', () => {
    render(<Meter value={45} aria-label="Battery" showValue={false} />);
    expect(screen.getByRole('meter', { name: 'Battery' })).toHaveAttribute('value', '45');
    expect(screen.queryByText('45 / 100')).not.toBeInTheDocument();
  });
  it('accepts unit-specific accessible value text and custom tones', () => {
    const { container } = render(
      <Meter
        label="Storage"
        value={6.5}
        max={10}
        aria-valuetext="6.5 GB of 10 GB"
        tone="warning"
      />,
    );
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '6.5 GB of 10 GB');
    expect(container.querySelector('.tori-meter-track')).toHaveClass('tori-meter-track--warning');
  });
});
