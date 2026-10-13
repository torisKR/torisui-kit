import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Timeline, TimelineItem } from '../components/timeline';

describe('Timeline', () => {
  it('represents actual ordered steps, current progress and completion in the accessibility tree', () => {
    render(
      <Timeline aria-label="Project progress">
        <TimelineItem title="Idea" status="completed" dateTime="2026-10-13" dateLabel="October 13">
          Brief ready
        </TimelineItem>
        <TimelineItem title="Design" status="current">
          Review the interface
        </TimelineItem>
        <TimelineItem title="Build">Implementation next</TimelineItem>
      </Timeline>,
    );
    const list = screen.getByRole('list', { name: 'Project progress' });
    expect(list.tagName).toBe('OL');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Completed');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
    expect(items[2]).toHaveTextContent('Upcoming');
    expect(screen.getByText('October 13')).toHaveAttribute('datetime', '2026-10-13');
  });

  it('moves the current semantic step when the caller advances its state', () => {
    const { rerender } = render(
      <Timeline>
        <TimelineItem title="Design" status="current" />
        <TimelineItem title="Build" />
      </Timeline>,
    );
    rerender(
      <Timeline>
        <TimelineItem title="Design" status="completed" />
        <TimelineItem title="Build" status="current" statusLabel="현재 단계" />
      </Timeline>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent('현재 단계');
  });
});
