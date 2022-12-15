import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import api from 'utils/api';

const SettingsMenu: React.FC = () => {
	const navigate = useNavigate();
	const [openSettings, setOpenSettings] = useState<boolean>(false);
	const settingsRef = useRef<any>();

	const handleLogout = () => {
		api.get(`${process.env.REACT_APP_SERVER_API}/auth/logout`)
			.then(() => {
				navigate('/login');
			})
			.catch((err) => {
				console.error(err);
			});
	};
	return (
		<>
			<IconButton ref={settingsRef} color="secondary" onClick={() => setOpenSettings(true)}>
				<MoreVertIcon />
			</IconButton>
			<Menu
				anchorEl={settingsRef.current}
				open={openSettings}
				onClose={() => setOpenSettings(false)}
			>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>
		</>
	);
};

export default SettingsMenu;
