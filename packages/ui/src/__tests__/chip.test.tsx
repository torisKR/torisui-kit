import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from '../components/chip';

describe('Chip', () => {
  it('supports keyboard removal with a name for the affected item', async () => {
    const user = userEvent.setup();
    function Example() {
      const [visible, setVisible] = React.useState(true);
      return visible ? (
        <Chip onRemove={() => setVisible(false)}>React</Chip>
      ) : (
        <p role="status">Filter removed</p>
      );
    }
    render(<Example />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Remove React' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Filter removed');
  });

  it('prevents removal of disabled chips and supports explicit labels for rich content', async () => {
    const user = userEvent.setup();
    const remove = vi.fn();
    render(
      <Chip disabled onRemove={remove} removeLabel="Remove required filter">
        <strong>Required</strong>
      </Chip>,
    );
    const button = screen.getByRole('button', { name: 'Remove required filter' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(remove).not.toHaveBeenCalled();
  });

  it('renders a plain display chip without inventing an interaction', () => {
    render(<Chip tone="success">Ready</Chip>);
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
