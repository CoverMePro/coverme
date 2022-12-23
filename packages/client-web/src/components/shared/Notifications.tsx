import React, { useState, useRef } from 'react';
import { IconButton, Menu, MenuItem, Badge, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { INotification, NotificationType } from 'coverme-shared';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SickIcon from '@mui/icons-material/Sick';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import TimerIcon from '@mui/icons-material/Timer';
import MessageIcon from '@mui/icons-material/Message';

import ClearIcon from '@mui/icons-material/Clear';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';

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

	const getIcon = (type: NotificationType) => {
		const icon: any = {
			'SHIFT': <CalendarMonthIcon/>,
			'TRADE': <CompareArrowsIcon/>,
			'SICK': <SickIcon/>,
			'TIMEOFF': <ConnectingAirportsIcon/>,
			'OVERTIME': <TimerIcon/>,
			'MESSAGE': <MessageIcon/>
		};

		return icon[type];
	}

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
						{getIcon(not.messageType)}
						<Typography variant="body1">{not.messageBody}</Typography>
						<Box>
							<ClearIcon />
							<AssistantDirectionIcon />
						</Box>
					</MenuItem>
				))}
				{notifications.length === 0 && <MenuItem>No New Notifications</MenuItem>}
			</Menu>
		</>
	);
};

export default Notifications;
