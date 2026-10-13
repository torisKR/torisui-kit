import * as React from 'react';
import { useControllableState } from '../hooks/use-controllable-state';
import { composeRefs } from '../primitives/slot';
import { cx } from '../utils/cx';
import { Field, type FieldOwnProps } from './field';

export interface TagInputMessages {
  duplicate: string;
  limit: string;
  tooLong: string;
  added: string;
  removed: string;
}
export interface TagInputProps extends FieldOwnProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  maxTags?: number;
  maxTagLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
  addLabel?: string;
  removeLabel?: (tag: string) => string;
  messages?: Partial<TagInputMessages>;
}

const defaultMessages: TagInputMessages = {
  duplicate: 'This tag already exists.',
  limit: 'The tag limit has been reached.',
  tooLong: 'This tag is too long.',
  added: 'Tag added:',
  removed: 'Tag removed:',
};

/** Enter or comma adds a trimmed, unique tag; Backspace on an empty field removes the last tag. */
export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    value: valueProp,
    defaultValue = [],
    onValueChange,
    maxTags = 8,
    maxTagLength = 24,
    disabled = false,
    readOnly = false,
    placeholder = 'Add a tag',
    id,
    name,
    className,
    label,
    helperText,
    error,
    wrapperClassName,
    'aria-label': ariaLabel,
    addLabel = 'Add tag',
    removeLabel = (tag) => `Remove ${tag}`,
    messages: customMessages,
  },
  ref,
) {
  const [tags, setTags] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [draft, setDraft] = React.useState('');
  const [validation, setValidation] = React.useState<string>();
  const [announcement, setAnnouncement] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autoId = React.useId();
  const controlId = id ?? `tori-tags-${autoId}`;
  const limit = Number.isFinite(maxTags) ? Math.max(0, Math.floor(maxTags)) : 8;
  const lengthLimit = Number.isFinite(maxTagLength) ? Math.max(1, Math.floor(maxTagLength)) : 24;
  const messages = { ...defaultMessages, ...customMessages };
  const previousTags = React.useRef(tags);
  React.useEffect(() => {
    const previous = previousTags.current;
    const added = tags.find((tag) => !previous.includes(tag));
    const removed = previous.find((tag) => !tags.includes(tag));
    if (added != null) setAnnouncement(`${messages.added} ${added}`);
    else if (removed != null) setAnnouncement(`${messages.removed} ${removed}`);
    previousTags.current = tags;
  }, [tags, messages.added, messages.removed]);
  const full = tags.length >= limit;
  const add = () => {
    if (disabled || readOnly) return;
    const tag = draft.trim();
    if (!tag) return;
    if (full) {
      setValidation(messages.limit);
      return;
    }
    if (tag.length > lengthLimit) {
      setValidation(messages.tooLong);
      return;
    }
    if (tags.some((existing) => existing.toLocaleLowerCase() === tag.toLocaleLowerCase())) {
      setValidation(messages.duplicate);
      return;
    }
    setTags([...tags, tag]);
    setDraft('');
    setValidation(undefined);
    inputRef.current?.focus();
  };
  const remove = (index: number) => {
    if (disabled || readOnly) return;
    const tag = tags[index];
    if (tag == null) return;
    setTags(tags.filter((_, current) => current !== index));
    setValidation(undefined);
    inputRef.current?.focus();
  };
  return (
    <Field
      controlId={controlId}
      label={label}
      helperText={helperText}
      error={error ?? validation}
      wrapperClassName={wrapperClassName}
    >
      {(a11y) => (
        <>
          <div className={cx('tori-tag-input', disabled && 'tori-tag-input--disabled', className)}>
            {tags.length > 0 && (
              <ul
                className="tori-tag-input__list"
                aria-label={typeof label === 'string' ? label : 'Tags'}
              >
                {tags.map((tag, index) => (
                  <li key={`${tag}-${index}`} className="tori-tag-input__tag">
                    <span>{tag}</span>
                    {!readOnly && (
                      <button
                        type="button"
                        className="tori-tag-input__remove"
                        aria-label={removeLabel(tag)}
                        disabled={disabled}
                        onClick={() => remove(index)}
                      >
                        ×
                      </button>
                    )}
                    {name && <input type="hidden" name={name} value={tag} disabled={disabled} />}
                  </li>
                ))}
              </ul>
            )}
            <div className="tori-tag-input__entry">
              <input
                {...a11y}
                ref={composeRefs(ref, inputRef)}
                type="text"
                className="tori-tag-input__control"
                aria-label={ariaLabel}
                placeholder={full ? messages.limit : placeholder}
                value={draft}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={lengthLimit + 1}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setValidation(undefined);
                }}
                onKeyDown={(event) => {
                  if (
                    event.nativeEvent.isComposing ||
                    event.keyCode === 229 ||
                    disabled ||
                    readOnly
                  )
                    return;
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault();
                    add();
                  } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
                    event.preventDefault();
                    remove(tags.length - 1);
                  }
                }}
              />
              {!readOnly && (
                <button
                  type="button"
                  className="tori-tag-input__add"
                  aria-label={addLabel}
                  disabled={disabled || full || !draft.trim()}
                  onClick={add}
                >
                  +
                </button>
              )}
            </div>
          </div>
          <span role="status" className="tori-sr-only" aria-live="polite">
            {announcement}
          </span>
        </>
      )}
    </Field>
  );
});
