import { Box, LinearProgress } from '@mui/material';
import React from 'react';

const LinearLoading: React.FC = () => {
    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    my: '5px',
                }}
            >
                <LinearProgress />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    my: '5px',
                }}
            >
                <LinearProgress />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    my: '5px',
                }}
            >
                <LinearProgress />
            </Box>
        </>
    );
};

export default LinearLoading;
