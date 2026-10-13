import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from '../components/tag-input';

describe('TagInput', () => {
  it('adds trimmed unique tags with Enter and comma', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TagInput label="Skills" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Skills' });
    await user.type(input, ' React {Enter}TypeScript,');
    expect(screen.getByText('React', { selector: 'li>span' })).toBeInTheDocument();
    expect(screen.getByText('TypeScript', { selector: 'li>span' })).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(onValueChange).toHaveBeenLastCalledWith(['React', 'TypeScript']);
  });
  it('rejects case-insensitive duplicates and announces a validation error', async () => {
    const user = userEvent.setup();
    render(<TagInput label="Skills" defaultValue={['React']} />);
    await user.type(screen.getByRole('textbox'), 'react{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('This tag already exists.');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  it('respects the tag count and length constraints', async () => {
    const user = userEvent.setup();
    render(<TagInput label="Skills" maxTags={1} maxTagLength={5} />);
    await user.type(screen.getByRole('textbox'), 'longer{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('This tag is too long.');
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'React{Enter}Vue{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('The tag limit has been reached.');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Add tag' })).toBeDisabled();
  });
  it('removes tags with the remove button and empty Backspace, retaining input focus', async () => {
    const user = userEvent.setup();
    render(<TagInput label="Skills" defaultValue={['React', 'CSS']} />);
    await user.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(screen.getByRole('textbox')).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Tag removed: CSS');
  });
  it('does not commit Enter while an IME composition is in progress', () => {
    render(<TagInput label="Skills" />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '디자인' } });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(input).toHaveValue('디자인');
  });
  it('keeps controlled tags pinned while notifying the parent', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TagInput label="Skills" value={['React']} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(onValueChange).toHaveBeenCalledWith([]);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
  it('announces controlled edits only after the parent accepts the new tags', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <TagInput label="Skills" value={['React']} onValueChange={onValueChange} />,
    );
    await user.type(screen.getByRole('textbox'), 'CSS{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(['React', 'CSS']);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    rerender(<TagInput label="Skills" value={['React', 'CSS']} onValueChange={onValueChange} />);
    expect(screen.getByRole('status')).toHaveTextContent('Tag added: CSS');
  });
  it('protects disabled and read-only lists from changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TagInput label="Skills" defaultValue={['React']} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeDisabled();
    rerender(<TagInput label="Skills" defaultValue={['React']} readOnly />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    screen.getByRole('textbox').focus();
    await user.keyboard('{Backspace}');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  it('serializes tags for form submission and supports localized labels', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TagInput
        label="분야"
        name="skills"
        defaultValue={['React']}
        addLabel="추가"
        removeLabel={(tag) => `${tag} 삭제`}
        messages={{ duplicate: '이미 있어요.' }}
      />,
    );
    expect(container.querySelector('input[name="skills"]')).toHaveValue('React');
    await user.type(screen.getByRole('textbox'), 'react{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('이미 있어요.');
    expect(screen.getByRole('button', { name: 'React 삭제' })).toBeInTheDocument();
  });
});
