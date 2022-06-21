import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';

interface IDeleteConfirmationProps {
    open: boolean;
    message: string;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Generic Delete confirmation component used when removing data
 */

// TO DO: Inherit from Basic confirmation and expand

const DeleteConfirmation: React.FC<IDeleteConfirmationProps> = ({
    open,
    message,
    isLoading,
    onClose,
    onConfirm,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress sx={{ mb: 1, mr: 1 }} size={25} />
                ) : (
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button color="error" onClick={onConfirm} autoFocus>
                            Delete
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmation;
