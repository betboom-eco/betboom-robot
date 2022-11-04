import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

declare global {
  interface Window {
    rusure(msg: ConfirmMessage): Promise<boolean>;
  }
}

export function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  okLabel = 'OK',
  cancelLabel = 'Cancel',
}: any) {
  const onCancel = () => onClose(false);
  const onOk = () => onClose(true);

  return (
    <Dialog
      onClose={onCancel}
      open={open}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 6,
          minWidth: 360,
          px: 1,
          background: '#212121',
        },
      }}
    >
      <IconButton
        sx={{ position: 'absolute', right: 8, top: 8 }}
        onClick={onCancel}
      >
        <CloseIcon />
      </IconButton>
      {title ? (
        <DialogTitle sx={{ textAlign: 'center', fontSize: 18 }}>
          {title}
        </DialogTitle>
      ) : null}
      <DialogContent sx={{ fontSize: 14, p: 2, textAlign: 'center' }}>
        {message}
      </DialogContent>
      <DialogActions
        sx={{
          fontSize: 16,
          my: 2,
          '& .MuiButton-root': {
            flex: 1,
            mx: 1,
          },
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            borderRadius: 50,
            height: 38,
            bgcolor: '#2D2E32',
            color: '#C1C1C1',
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onOk}
          variant="contained"
          sx={{ borderRadius: 50, height: 38 }}
        >
          {okLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type ConfirmMessage =
  | {
      title?: React.ReactNode;
      message?: React.ReactNode;
      okLabel?: string;
      cancelLabel?: string;
    }
  | string;

export function ConfirmProvider(props: any) {
  const [open, setOpen] = useState(false);
  const [msg, setConfirm] = useState({});

  useEffect(() => {
    window.rusure = async (msg: ConfirmMessage) =>
      new Promise((resolve) => {
        if (typeof msg === 'string') {
          msg = { message: msg };
        }
        setConfirm({
          ...msg,
          onClose(res: boolean) {
            resolve(res);
            setOpen(false);
          },
        });
        setOpen(true);
      });
  }, []);

  return (
    <>
      <ConfirmDialog open={open} {...msg} />
    </>
  );
}
