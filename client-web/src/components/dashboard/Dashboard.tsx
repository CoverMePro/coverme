import React from 'react';
import { useSnackbar } from 'notistack';
import { Outlet } from 'react-router';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box, Typography, Drawer, Divider, Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { DRAWER_WIDTH } from '../../constants';
import SettingsMenu from 'components/navigation/SettingsMenu';
import Navigation from 'components/navigation/Navigation';
import MainSection from './MainSection';

import { onMessageListener } from '../../messaging_init_in_sw';

const Dashboard: React.FC = () => {
    const user = useTypedSelector((state) => state.user);
    const company = useTypedSelector((state) => state.company);

    const { enqueueSnackbar } = useSnackbar();

    onMessageListener()
        .then((payload) => {
            console.log('messageReceived');
            console.log(payload);
            enqueueSnackbar(`Message Received: ${payload.notification.body}`, { variant: 'info' });
        })
        .catch((err) => console.log('failed: ', err));

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        backgroundColor: 'primary.main',
                        color: 'white',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={true}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ padding: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box>
                                    <Avatar sx={{ bgcolor: '#83c5be', color: '#006d77' }}>
                                        {user.firstName[0].toUpperCase() +
                                            user.lastName[0].toUpperCase()}
                                    </Avatar>
                                </Box>
                                <Box>
                                    <Typography sx={{ mr: 2 }} variant="h6">
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography sx={{ mr: 2 }} variant="body1">
                                        {company.name}
                                    </Typography>
                                </Box>

                                {/* <IconButton color="secondary">
                            <NotificationsIcon />
                        </IconButton> */}
                                <SettingsMenu />
                            </Box>
                        </Box>
                        <Divider />
                        <Navigation />
                    </Box>
                </Box>
            </Drawer>
            <MainSection open={true}>
                <Outlet />
            </MainSection>
        </Box>
    );
};

export default Dashboard;
