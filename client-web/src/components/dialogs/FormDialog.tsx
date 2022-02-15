import React from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IFormDialogProps {
    open: boolean;
    onClose: () => void;
}

const FormDialog: React.FC<IFormDialogProps> = ({ open, onClose, children }) => {
    return (
        <Dialog sx={{ position: 'relative' }} open={open}>
            <Box sx={{ position: 'absolute', right: 5, zIndex: 400 }}>
                <IconButton onClick={onClose}>
                    <CloseIcon color="primary" fontSize="large" />
                </IconButton>
            </Box>

            {children}
        </Dialog>
    );
};

export default FormDialog;
