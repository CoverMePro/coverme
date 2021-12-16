import React, { createContext, useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface ISnackbarProps {
  message: string;
  open: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ISnackbarContextProps {
  openSnackbar: (message: string, type: SnackbarType) => void;
}

export const SnackbarContext = createContext<ISnackbarContextProps>({
  openSnackbar: () => {},
});

const SnackbarProvider: React.FC = ({ children }) => {
  const [snackbar, setSnackbar] = useState<ISnackbarProps>({
    message: '',
    open: false,
    type: 'info',
  });

  const handleOpen = (message: string, type: SnackbarType) => {
    setSnackbar({ open: true, message, type });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const TransitionUp = (props: any) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar: handleOpen }}>
      {children}
      <Snackbar
        open={snackbar.open}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        TransitionComponent={TransitionUp}
      >
        <Alert variant="filled" onClose={handleClose} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
