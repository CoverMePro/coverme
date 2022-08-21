import React from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Grid, Typography } from '@mui/material';
import TodayWidget from 'components/widgets/TodayWidget';
import MessageWidget from 'components/widgets/MessageWidget';
import CalendarWidget from 'components/widgets/CalendarWidget';

const HomeView: React.FC = () => {
    const user = useTypedSelector((state) => state.user);
    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h1">Welcome, {user.firstName}!</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item sx={{ height: '500px' }} sm={12} md={6} lg={4}>
                    <TodayWidget />
                </Grid>
                <Grid item sx={{ height: '500px' }} sm={12} md={6} lg={8}>
                    <MessageWidget />
                </Grid>
                <Grid item sx={{ height: '700px' }} sm={12} md={12} lg={12}>
                    <CalendarWidget />
                </Grid>
            </Grid>
        </>
    );
};

export default HomeView;
