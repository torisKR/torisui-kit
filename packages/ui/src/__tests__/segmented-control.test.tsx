import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../components/segmented-control';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];
describe('SegmentedControl', () => {
  it('selects one radio and never deselects the active option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl options={options} aria-label="Period" onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'false');
    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
  it('moves focus and selection with arrows, wrapping and skipping disabled options', async () => {
    const user = userEvent.setup();
    render(
      <SegmentedControl
        options={[options[0]!, { ...options[1]!, disabled: true }, options[2]!]}
        aria-label="Period"
      />,
    );
    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
  });
  it('supports Home/End and the vertical orientation', async () => {
    const user = userEvent.setup();
    render(<SegmentedControl options={options} aria-label="Period" orientation="vertical" />);
    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{End}{ArrowUp}');
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
  });
  it('exposes one tabstop even when controlled value is missing from options', () => {
    render(<SegmentedControl value="missing" options={options} aria-label="Period" />);
    expect(screen.getAllByRole('radio').filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
  });
  it('retains the controlled selection when a parent ignores the callback', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        options={options}
        value="day"
        onValueChange={onValueChange}
        aria-label="Period"
      />,
    );
    await user.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onValueChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
  });
  it('disables all options and serializes selected form values', () => {
    const { container } = render(
      <SegmentedControl
        options={options}
        defaultValue="week"
        name="period"
        disabled
        aria-label="Period"
      />,
    );
    expect(
      screen.getAllByRole('radio').every((radio) => (radio as HTMLButtonElement).disabled),
    ).toBe(true);
    expect(container.querySelector('input[name="period"]')).toHaveValue('week');
    expect(container.querySelector('input[name="period"]')).toBeDisabled();
  });
});
