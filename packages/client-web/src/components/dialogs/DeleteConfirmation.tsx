import React from 'react';
import BasicConfirmation from './BasicConfirmation';

interface IDeleteConfirmationProps {
	open: boolean;
	message: string;
	isLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const DeleteConfirmation: React.FC<IDeleteConfirmationProps> = ({
	open,
	message,
	isLoading,
	onClose,
	onConfirm,
}) => {
	return (
		<BasicConfirmation
			title="Delete Confirmation"
			message={message}
			open={open}
			isLoading={isLoading}
			onClose={onClose}
			buttons={[
				{ text: 'Cancel', color: 'primary', onClick: onClose },
				{ text: 'Delete', color: 'error', onClick: onConfirm },
			]}
		/>
	);
};

export default DeleteConfirmation;
