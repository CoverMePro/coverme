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

interface IConfirmationButton {
    text: string;
    color: 'primary' | 'success' | 'error' | 'warning';
    onClick: () => void;
}

interface IBasicConfirmationProps {
    open: boolean;
    title: string;
    message: string;
    isLoading: boolean;
    onClose: () => void;
    buttons: IConfirmationButton[];
}

const BasicConfirmation: React.FC<IBasicConfirmationProps> = ({
    open,
    title,
    message,
    isLoading,
    onClose,
    buttons,
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
                        {buttons.map((button) => {
                            <Button color={button.color} onClick={button.onClick}>
                                {button.text}
                            </Button>;
                        })}
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BasicConfirmation;
