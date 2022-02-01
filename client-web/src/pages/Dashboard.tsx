import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';

import { styled } from '@mui/material/styles';

import {
    Box,
    IconButton,
    Toolbar,
    Typography,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';

import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

import axios from 'utils/axios-intance';

const drawerWidth = 300;

// Styling the main view to adapt to the nav drawer
// Currently it is always open, but we may change this later
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

// Styling the App bar to adapt to the nav drawer
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Drawer header style to have a title and flush with the app Bar
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Dashboard: React.FC = () => {
    const user = useTypedSelector((state) => state.user);
    const navigate = useNavigate();
    const { setUser } = useActions();

    const [openSettings, setOpenSettings] = useState<boolean>(false);
    const [navSelected, setNavSelected] = useState<number>(0);

    const settingsRef = useRef<any>();

    const location = useLocation();
    const handleTopLevelNav = (subRoute: string) => {
        navigate(`./${subRoute}`);
    };

    const handleLogout = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/auth/logout`)
            .then(() => {
                navigate('/login');
                setUser({});
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        const navSelected: any = {
            '/dashboard/home': 0,
            '/dashboard/staff-view': 1,
            '/dashboard/teams': 2,
            '/dashboard/companies': 3,
        };

        setNavSelected(navSelected[location.pathname]);
    }, [location.pathname]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={true}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography sx={{ mr: 2 }} variant="body1">
                            {user.firstName} {user.lastName}
                        </Typography>
                        <IconButton color="secondary">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton
                            ref={settingsRef}
                            color="secondary"
                            onClick={() => setOpenSettings(true)}
                        >
                            <SettingsIcon />
                        </IconButton>
                        <Menu
                            anchorEl={settingsRef.current}
                            open={openSettings}
                            onClose={() => setOpenSettings(false)}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'primary.main',
                        color: 'white',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={true}
            >
                <DrawerHeader>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        {user.role !== 'admin' ? user.company : 'Admin'}
                    </Typography>
                </DrawerHeader>
                <Divider />
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={navSelected === 0}
                            onClick={() => handleTopLevelNav('home')}
                        >
                            <ListItemIcon>
                                <HomeIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                {user.role === 'admin' && (
                    <List disablePadding>
                        <ListItem disablePadding>
                            <ListItemButton
                                selected={navSelected === 3}
                                onClick={() => handleTopLevelNav('companies')}
                            >
                                <ListItemIcon>
                                    <BusinessIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary="Companies" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
                {user.role === 'owner' && (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                selected={navSelected === 1}
                                onClick={() => handleTopLevelNav('staff-view')}
                            >
                                <ListItemIcon>
                                    <PeopleIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary="Staff" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                selected={navSelected === 2}
                                onClick={() => handleTopLevelNav('teams')}
                            >
                                <ListItemIcon>
                                    <GroupWorkIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary="Teams" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
            </Drawer>
            <Main open={true}>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
};

export default Dashboard;
