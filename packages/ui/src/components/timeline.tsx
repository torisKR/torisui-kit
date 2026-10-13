import * as React from 'react';
import { cx } from '../utils/cx';

export type TimelineProps = React.OlHTMLAttributes<HTMLOListElement>;
export type TimelineStatus = 'completed' | 'current' | 'upcoming';
export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title: React.ReactNode;
  status?: TimelineStatus;
  statusLabel?: string;
  dateTime?: string;
  dateLabel?: React.ReactNode;
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { className, children, ...props },
  ref,
) {
  return (
    <ol {...props} role={props.role ?? 'list'} ref={ref} className={cx('tori-timeline', className)}>
      {children}
    </ol>
  );
});

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  function TimelineItem(
    { title, status = 'upcoming', statusLabel, dateTime, dateLabel, className, children, ...props },
    ref,
  ) {
    const label =
      statusLabel ??
      { completed: 'Completed', current: 'Current step', upcoming: 'Upcoming' }[status];
    return (
      <li
        {...props}
        ref={ref}
        className={cx('tori-timeline__item', `tori-timeline__item--${status}`, className)}
        aria-current={status === 'current' ? 'step' : undefined}
      >
        <span className="tori-timeline__marker" aria-hidden="true">
          {status === 'completed' ? (
            <svg
              viewBox="0 0 20 20"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m4 10 4 4 8-8" />
            </svg>
          ) : (
            <span />
          )}
        </span>
        <div className="tori-timeline__content">
          <div className="tori-timeline__heading">
            <span className="tori-timeline__title">{title}</span>
            {(dateTime || dateLabel != null) && (
              <time dateTime={dateTime} className="tori-timeline__date">
                {dateLabel ?? dateTime}
              </time>
            )}
          </div>
          <span className="tori-sr-only">{label}</span>
          {children != null && <div className="tori-timeline__description">{children}</div>}
        </div>
      </li>
    );
  },
);
