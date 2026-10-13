import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from '../components/number-input';

describe('NumberInput', () => {
  it('steps within bounds and disables boundary controls', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberInput label="Seats" min={1} max={3} defaultValue={1} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Seats' });
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(input).toHaveValue(3);
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
  });
  it('uses decimal steps without a floating point display artifact', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Opacity" defaultValue={0.2} step={0.1} />);
    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(0.3);
  });
  it('preserves unit steps for large safe integers', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Large count" defaultValue={1_000_000_000_000} step={1} />);
    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(1_000_000_000_001);
    screen.getByRole('spinbutton').focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('spinbutton')).toHaveValue(1_000_000_000_002);
  });
  it('allows range drafts then clamps when leaving the field', () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput label="Count" min={0} max={10} defaultValue={3} onValueChange={onValueChange} />,
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '15' } });
    expect(input).toHaveValue(15);
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(input).toHaveValue(10);
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });
  it('restores the previous number for an empty draft', () => {
    render(<NumberInput label="Count" defaultValue={4} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(4);
  });
  it('reports controlled changes while preserving a pinned parent value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Count" value={4} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Increase value' }));
    expect(onValueChange).toHaveBeenCalledWith(5);
    expect(screen.getByRole('spinbutton')).toHaveValue(4);
  });
  it('handles arrow keys with the configured step', async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Count" defaultValue={2} step={2} min={0} max={6} />);
    screen.getByRole('spinbutton').focus();
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowDown}');
    expect(screen.getByRole('spinbutton')).toHaveValue(4);
  });
  it('wires field errors and forwards the input ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} label="Count" error="Invalid count" />);
    expect(ref.current).toBe(screen.getByRole('spinbutton'));
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
    expect(ref.current).toHaveAttribute('aria-describedby', screen.getByRole('alert').id);
  });
  it('prevents changes when disabled or read-only', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<NumberInput label="Count" disabled />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
    rerender(<NumberInput label="Count" readOnly defaultValue={0} />);
    screen.getByRole('spinbutton').focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeDisabled();
  });
});
