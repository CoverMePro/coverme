import { Box, LinearProgress } from '@mui/material';
import React from 'react';

// TO DO: Make better, and make different types?

const LinearLoading: React.FC = () => {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    my: '5px',
                }}
            >
                <LinearProgress />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    my: '5px',
                }}
            >
                <LinearProgress />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    my: '5px',
                }}
            >
                <LinearProgress />
            </Box>
        </Box>
    );
};

export default LinearLoading;
