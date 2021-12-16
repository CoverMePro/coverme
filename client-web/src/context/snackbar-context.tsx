import React, { createContext, useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

interface ISnackbarProps {
	message: string;
	open: boolean;
	type: 'success' | 'error' | 'warning' | 'info';
}

export const SnackbarContext = createContext<Partial<ISnackbarProps>>({});

const SnackbarProvider: React.FC = ({ children }) => {
	const [snackbar, setSnackbar] = useState<ISnackbarProps>({
		message: '',
		open: false,
		type: 'info'
	});

	const handleClose = () => {
		setSnackbar(prev => ({ ...prev, open: false }));
	};

	const TransitionUp = (props: any) => {
		return <Slide {...props} direction="up" />;
	};

	return (
		<SnackbarContext.Provider value={{}}>
			{children}
			<Snackbar
				open={snackbar.open}
				onClose={handleClose}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				TransitionComponent={TransitionUp}
			>
				<Alert onClose={handleClose} severity={snackbar.type}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
};

export default SnackbarProvider;
