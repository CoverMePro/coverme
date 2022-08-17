import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const PageLoading: React.FC = () => {
    return (
        <Box
            sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <CircularProgress size={100} />
        </Box>
    );
};

export default PageLoading;
