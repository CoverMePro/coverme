import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton, Menu, MenuItem } from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';

import axios from 'utils/axios-intance';

const SettingsMenu: React.FC = () => {
    const navigate = useNavigate();
    const [openSettings, setOpenSettings] = useState<boolean>(false);
    const settingsRef = useRef<any>();

    const handleLogout = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/auth/logout`)
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
                <SettingsIcon />
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
