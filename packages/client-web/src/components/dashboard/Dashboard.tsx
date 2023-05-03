import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Outlet } from 'react-router';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box, Typography, Drawer, Divider, Avatar, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { DRAWER_WIDTH } from '../../constants';
import MainSection from './MainSection';
import SettingsMenu from 'components/navigation/SettingsMenu';
import Navigation from 'components/navigation/Navigation';
import Notifications from 'components/shared/Notifications';

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { collection, query, where, onSnapshot, getFirestore } from 'firebase/firestore';

import { INotification } from 'coverme-shared';

import api from 'utils/api';

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
const db = getFirestore(app);

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

	// onMessageListener()
	// 	.then((payload: any) => {
	// 		enqueueSnackbar(`${payload.notification.title}: ${payload.notification.body}`, {
	// 			variant: 'info',
	// 		});

	// 		const newNotifications: INotification[] = [
	// 			...notifications,
	// 			{
	// 				id: payload.data.id,
	// 				messageTitle: payload.notification.title,
	// 				messageBody: payload.notification.body,
	// 				messageType: payload.notification.type,
	// 			},
	// 		];

	// 		setNotifications([...newNotifications]);
	// 	})
	// 	.catch((err) => console.log('failed: ', err));

	useEffect(() => {
		const q = query(
			collection(db, 'notifications'),
			where('usersNotified', 'array-contains', user.id)
		);
		const Unsubscribe = onSnapshot(q, (snapshot) => {
			console.log('UPDATED');
			const retreivedNotifications: INotification[] = [];
			snapshot.forEach((doc) => {
				retreivedNotifications.push({
					id: doc.id,
					...doc.data(),
				} as INotification);
			});

			setNotifications(retreivedNotifications);
		});

		return () => {
			Unsubscribe();
		};
	}, [user.id]);

	const handleCloseNotifications = () => {
		// const notIds = notifications.map((not) => not.id);
		// api.post(`notifications/acknowledge-many`, {
		// 	userId: user.id,
		// 	notificationIds: notIds,
		// })
		// 	.then(() => {
		// 		console.log('notifications acknowledge');
		// 		setNotifications([]);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	})
		// 	.finally(() => {});
	};

	const handleText = () => {
		api.post('send-sms', {})
			.then(() => {
				console.log('message sent');
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleOpenNotifications = (userSeenNots: string[]) => {
		// mark all notifcations as seen my user
			api.post(`notifications/seen`, {
			userId: user.id,
			notificationIds: userSeenNots,
		})
			.then(() => {
				console.log('notifications seen');
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {});

		const updatedNotifications = notifications.map(not => {
			const userSeen = not.usersSeen ? not.usersSeen : [];

			if (userSeen.findIndex(id => id === user.id) === -1) {
				userSeen.push(user.id);
			}
			
			return not;
		});

		setNotifications(updatedNotifications);
	}

	const handleRemoveNotification = (id: string) => {
		const newNotifications = notifications.filter((not) => not.id! !== id);
		setNotifications([...newNotifications]);
	};

	const handleRemoveAllNotifications = () => {
		setNotifications([]);
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
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
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
									<Avatar
										sx={{
											bgcolor: '#83c5be',
											color: '#006d77',
										}}
									>
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
								<Box>
									<Notifications
										notifications={notifications}
										onOpen={handleOpenNotifications}
										onClose={handleCloseNotifications}
										onClearNotifications={handleRemoveNotification}
										onClearAllNotifications={handleRemoveAllNotifications}
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
