import React, { useState, useRef } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useNavigate } from 'react-router-dom';

import { IconButton, Menu, MenuItem, Badge, Typography, Box, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SickIcon from '@mui/icons-material/Sick';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import TimerIcon from '@mui/icons-material/Timer';
import MessageIcon from '@mui/icons-material/Message';
import ClearIcon from '@mui/icons-material/Clear';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';

import { INotification, NotificationType } from 'coverme-shared';
import api from 'utils/api';

interface INotificationsProps {
	notifications: INotification[];
	onOpen: (unseenNotIds: string[]) => void;
	onClose: () => void;
	onClearNotifications: (id: string) => void;
	onClearAllNotifications: () => void;
}

const Notifications: React.FC<INotificationsProps> = ({
	notifications,
	onOpen,
	onClose,
	onClearAllNotifications,
	onClearNotifications,
}) => {
	const [openNotifications, setOpenNotifications] = useState<boolean>(false);
	const notRef = useRef<any>();
	const user = useTypedSelector((state) => state.user);
	const navigate = useNavigate();

	const handleCloseNotifications = () => {
		onClose();
		setOpenNotifications(false);
	};

	const navigateTo = (type: NotificationType) => {
		const routes: any = {
			0: 'calendar',
			1: 'request/trade',
			2: 'request/sick',
			3: 'request/leave',
			4: 'overtime/callouts',
			5: 'blog',
		};

		handleCloseNotifications();

		navigate(`./${routes[`${type}`]}`);
	};

	const getIcon = (type: NotificationType) => {
		const icon: any = {
			0: <EventNoteIcon color="primary" />,
			1: <CompareArrowsIcon color="primary" />,
			2: <SickIcon color="primary" />,
			3: <ConnectingAirportsIcon color="primary" />,
			4: <TimerIcon color="primary" />,
			5: <MessageIcon color="primary" />,
		};

		return icon[`${type}`];
	};

	const handleClearNotification = (id: string) => {
		api.post('notifications/acknowledge-one', {
			notificationId: id,
			userId: user.id,
		}).catch((error) => {
			console.error(error);
		});

		onClearNotifications(id);
	};

	const handleClearAllNotifications = () => {
		api.post('notifications/acknowledge-many', {
			notificationIds: notifications.map((not) => not.id!),
			userId: user.id,
		}).catch((error) => {
			console.error(error);
		});

		onClearAllNotifications();
	};

	const handleOpenNotifications = () => {
		const unseenNotIds: string[] = [];
		notifications.forEach((not) => {
			if (
				not.usersSeen === undefined ||
				not.usersSeen === null ||
				(not.usersSeen && not.usersSeen.findIndex((id) => id === user.id) === -1)
			) {
				unseenNotIds.push(not.id!);
			}
		});

		onOpen(unseenNotIds);
		setOpenNotifications(true);
	};

	const getUnseenNotifications = () => {
		if (notifications === undefined || notifications === null || notifications.length === 0) {
			return 0;
		}

		let unseen = 0;

		notifications.forEach((not) => {
			if (
				not.usersSeen === undefined ||
				not.usersSeen === null ||
				(not.usersSeen && not.usersSeen.findIndex((id) => id === user.id) === -1)
			) {
				unseen++;
			}
		});

		console.log(unseen);

		return unseen;
	};

	return (
		<>
			<IconButton ref={notRef} color="secondary" onClick={handleOpenNotifications}>
				{!openNotifications ? (
					<Badge badgeContent={getUnseenNotifications()} color="secondary">
						<NotificationsIcon />
					</Badge>
				) : (
					<NotificationsIcon />
				)}
			</IconButton>
			<Menu
				anchorEl={notRef.current}
				open={openNotifications}
				onClose={handleCloseNotifications}
			>
				{notifications.map((not) => (
					<Box
						key={not.id}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: '1rem',
							alignItems: 'center',
							padding: '0.5rem',
						}}
					>
						<Box>{getIcon(not.messageType)}</Box>

						<Typography variant="body1">{not.messageBody}</Typography>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								gap: '1rem',
								alignItems: 'center',
							}}
						>
							<Tooltip title="Go To">
								<IconButton onClick={() => navigateTo(not.messageType)}>
									<AssistantDirectionIcon color="primary" />
								</IconButton>
							</Tooltip>

							<Tooltip title="Clear Notification">
								<IconButton onClick={() => handleClearNotification(not.id!)}>
									<ClearIcon color="primary" />
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
				))}
				{notifications.length !== 0 && (
					<MenuItem
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						onClick={handleClearAllNotifications}
					>
						<Typography variant="h5">Clear All Notifications</Typography>
					</MenuItem>
				)}
				{notifications.length === 0 && <MenuItem>No New Notifications</MenuItem>}
			</Menu>
		</>
	);
};

export default Notifications;
