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

interface IBasicConfirmationProps {
    open: boolean;
    title: string;
    message: string;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Generic Delete confirmation component used when removing data
 */

const BasicConfirmation: React.FC<IBasicConfirmationProps> = ({
    open,
    title,
    message,
    isLoading,
    onClose,
    onConfirm,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress sx={{ mb: 1, mr: 1 }} size={25} />
                ) : (
                    <>
                        <Button color="error" onClick={onClose}>
                            No
                        </Button>
                        <Button color="success" onClick={onConfirm} autoFocus>
                            Yes
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BasicConfirmation;
