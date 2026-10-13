import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '../components/search-input';

describe('SearchInput', () => {
  it('clears an uncontrolled search without losing input focus', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onValueChange = vi.fn();
    render(
      <SearchInput
        label="Find components"
        defaultValue="Button"
        onClear={onClear}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('searchbox', { name: 'Find components' });
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('consumes Escape while clearing, then lets empty Escape reach a parent', async () => {
    const user = userEvent.setup();
    const parentKeyDown = vi.fn();
    render(
      <div onKeyDown={parentKeyDown}>
        <SearchInput aria-label="Search" defaultValue="Tabs" />
      </div>,
    );
    const input = screen.getByRole('searchbox');
    await user.click(input);
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(parentKeyDown).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(parentKeyDown).toHaveBeenCalledTimes(1);
  });

  it('updates controlled values for both typing and clear', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Example() {
      const [value, setValue] = React.useState('');
      return (
        <SearchInput
          aria-label="Search"
          value={value}
          onValueChange={setValue}
          onChange={onChange}
        />
      );
    }
    render(<Example />);
    await user.type(screen.getByRole('searchbox'), 'Chip');
    expect(screen.getByRole('searchbox')).toHaveValue('Chip');
    expect(onChange).toHaveBeenCalledTimes(4);
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('does not clear the query when Escape cancels IME composition', () => {
    const onClear = vi.fn();
    render(<SearchInput aria-label="Search" defaultValue="기존 검색어" onClear={onClear} />);
    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(input, { key: 'Escape', isComposing: true });
    expect(input).toHaveValue('기존 검색어');
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 229 });
    expect(input).toHaveValue('기존 검색어');
    expect(onClear).not.toHaveBeenCalled();
  });

  it('does not change a read-only query and honors prevented keyboard events', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const { rerender } = render(
      <SearchInput aria-label="Search" defaultValue="Label" readOnly onClear={onClear} />,
    );
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeDisabled();
    await user.click(screen.getByRole('searchbox'));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('searchbox')).toHaveValue('Label');
    expect(onClear).not.toHaveBeenCalled();
    rerender(
      <SearchInput
        aria-label="Search"
        defaultValue="Label"
        onKeyDown={(event) => event.preventDefault()}
        onClear={onClear}
      />,
    );
    await user.keyboard('{Escape}');
    expect(screen.getByRole('searchbox')).toHaveValue('Label');
  });

  it('forwards the input ref and preserves Field error wiring', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} label="Search" error="Please enter a term" />);
    expect(ref.current).toBe(screen.getByRole('searchbox'));
    expect(ref.current).toHaveAttribute('aria-invalid', 'true');
    expect(ref.current).toHaveAccessibleDescription('Please enter a term');
  });
});
