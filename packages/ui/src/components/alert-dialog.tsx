import * as React from 'react';
import { cx } from '../utils/cx';
import { Dialog, type DialogProps } from './dialog';
import { Button } from './button';

export interface AlertDialogProps extends Omit<
  DialogProps,
  'role' | 'footer' | 'showClose' | 'closeOnOverlayClick'
> {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmDisabled?: boolean;
  destructive?: boolean;
}

/** A controlled confirmation modal. Cancel receives initial focus. */
export function AlertDialog({
  onOpenChange,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmDisabled = false,
  destructive = true,
  className,
  ...props
}: AlertDialogProps) {
  function cancel() {
    onCancel?.();
    onOpenChange?.(false);
  }
  return (
    <Dialog
      {...props}
      role="alertdialog"
      closeOnOverlayClick={false}
      showClose={false}
      className={cx('tori-alert-dialog', className)}
      onOpenChange={(open) => {
        if (!open) cancel();
      }}
      footer={
        <>
          <Button variant="outline" data-autofocus onClick={cancel}>
            {cancelLabel}
          </Button>
          <Button
            className={cx(
              'tori-alert-dialog__confirm',
              destructive && 'tori-alert-dialog__confirm--danger',
            )}
            disabled={confirmDisabled}
            onClick={() => {
              onConfirm?.();
              onOpenChange?.(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
