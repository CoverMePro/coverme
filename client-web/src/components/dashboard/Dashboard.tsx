import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Outlet } from 'react-router';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box, Typography, Drawer, Divider, Avatar, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { DRAWER_WIDTH } from '../../constants';
import SettingsMenu from 'components/navigation/SettingsMenu';
import Navigation from 'components/navigation/Navigation';
import MainSection from './MainSection';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import axios from 'utils/axios-intance';
import Notifications from 'components/shared/Notifications';
import { INotification } from 'models/Notification';

//import { onMessageListener } from '../../messaging_init_in_sw';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_APP_KEY,
    authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FB_MSG_SENDER_ID,
    appId: process.env.REACT_APP_FB_APP_ID,
    measurementId: process.env.REACT_APP_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

const Dashboard: React.FC = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const user = useTypedSelector((state) => state.user);
    const company = useTypedSelector((state) => state.company);

    const { enqueueSnackbar } = useSnackbar();

    onMessageListener()
        .then((payload: any) => {
            enqueueSnackbar(`${payload.notification.title}: ${payload.notification.body}`, {
                variant: 'info',
            });

            const newNotifications = [
                ...notifications,
                {
                    id: payload.data.id,
                    messageTitle: payload.notification.title,
                    messageBody: payload.notification.body,
                },
            ];

            setNotifications([...newNotifications]);
        })
        .catch((err) => console.log('failed: ', err));

    useEffect(() => {
        getToken(messaging, {
            vapidKey: process.env.REACT_APP_FB_MESSAGE_KEY,
        }).then((currentToken) => {
            if (currentToken) {
                console.log('Current Token: ', currentToken);

                axios
                    .post(`${process.env.REACT_APP_SERVER_API}/auth/update-message-token`, {
                        userId: user.id,
                        token: currentToken,
                    })
                    .then(() => {
                        console.log('SUCCESS token updated');
                    })
                    .catch((error) => {})
                    .finally(() => {});
            } else {
                console.log('Can not get current token');
            }
        });

        axios
            .get(`${process.env.REACT_APP_SERVER_API}/notifications/${user.id}`)
            .then((notificationResult) => {
                console.log('got notifications');
                console.log(notificationResult.data);
                setNotifications(notificationResult.data.notifications);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {});
    }, []);

    const handleCloseNotifications = () => {
        const notIds = notifications.map((not) => not.id);

        axios
            .post(`${process.env.REACT_APP_SERVER_API}/notifications/acknowledge-many`, {
                userId: user.id,
                notificationIds: notIds,
            })
            .then(() => {
                console.log('notifications acknowledge');
                setNotifications([]);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {});
    };

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
                                    <Typography variant="h6" sx={{ fontSize: '16px' }}>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography variant="body1">{company.name}</Typography>
                                </Box>

                                {/* <IconButton color="secondary">
                            <NotificationsIcon />
                        </IconButton> */}
                                <Box>
                                    <Notifications
                                        notifications={notifications}
                                        onClose={handleCloseNotifications}
                                    />
                                    <SettingsMenu />
                                </Box>
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
