import React, { useState, useRef } from 'react';
import { IconButton, Menu, MenuItem, Badge, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { INotification } from 'coverme-shared';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

interface INotificationsProps {
	notifications: INotification[];
	onClose: () => void;
}

const Notifications: React.FC<INotificationsProps> = ({ notifications, onClose }) => {
	const [openNotifications, setOpenNotifications] = useState<boolean>(false);
	const notRef = useRef<any>();

	const handleCloseNotifications = () => {
		onClose();
		setOpenNotifications(false);
	};

	return (
		<>
			<IconButton ref={notRef} color="secondary" onClick={() => setOpenNotifications(true)}>
				{!openNotifications ? (
					<Badge badgeContent={notifications.length} color="secondary">
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
					<MenuItem
						key={not.id}
						sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
					>
						<NotificationsActiveIcon />
						<Typography variant="body1">{not.messageBody}</Typography>
					</MenuItem>
				))}
				{notifications.length === 0 && <MenuItem>No New Notifications</MenuItem>}
			</Menu>
		</>
	);
};

export default Notifications;
