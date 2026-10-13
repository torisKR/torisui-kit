import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from '../components/stepper';

const steps = [{ label: 'Details' }, { label: 'Review' }, { label: 'Finish' }];
describe('Stepper', () => {
  it('exposes current workflow step and updates on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper steps={steps} aria-label="Create project" onValueChange={onValueChange} />);
    expect(screen.getByRole('navigation', { name: 'Create project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('aria-current', 'step');
    await user.click(screen.getByRole('button', { name: 'Review' }));
    expect(screen.getByRole('button', { name: 'Review' })).toHaveAttribute('aria-current', 'step');
    expect(onValueChange).toHaveBeenCalledWith(1);
  });
  it('skips disabled steps and stops at keyboard boundaries', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Stepper
        steps={[steps[0]!, { ...steps[1]!, disabled: true }, steps[2]!]}
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole('button', { name: 'Details' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Finish' })).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Review' })).toBeDisabled();
  });
  it('supports vertical arrows and Home/End', async () => {
    const user = userEvent.setup();
    render(<Stepper steps={steps} orientation="vertical" />);
    screen.getByRole('button', { name: 'Details' }).focus();
    await user.keyboard('{End}{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Review' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'Details' })).toHaveFocus();
  });
  it('keeps a controlled current step when changes are ignored', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper steps={steps} value={0} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('aria-current', 'step');
  });
  it('handles empty and disabled step lists with no focusable controls', () => {
    const { rerender } = render(<Stepper steps={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<Stepper steps={steps} disabled />);
    expect(
      screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled),
    ).toBe(true);
    expect(screen.getAllByRole('button').every((button) => button.tabIndex === -1)).toBe(true);
  });
  it('clamps an out-of-range current step without claiming nonexistent steps', () => {
    render(<Stepper steps={steps} value={20} />);
    expect(screen.getByRole('button', { name: 'Finish' })).toHaveAttribute('aria-current', 'step');
    expect(screen.getAllByRole('button').filter((button) => button.tabIndex === 0)).toHaveLength(1);
  });
});
