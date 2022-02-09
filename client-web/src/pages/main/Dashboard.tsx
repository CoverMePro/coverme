import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { styled } from '@mui/material/styles';

import { Box, Toolbar, Typography, Drawer, Divider } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';

import SettingsMenu from 'components/navigation/SettingsMenu';
import NavList from 'components/navigation/NavList';

import { adminNav, mainNav, ownerNav } from 'utils/navs';

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

    const [navSelected, setNavSelected] = useState<number>(0);

    const location = useLocation();

    useEffect(() => {
        const navSelected: any = {
            '/dashboard/home': 0,
            '/dashboard/companies': 1,
            '/dashboard/staff-view': 2,
            '/dashboard/teams': 3,
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
                        {/* <IconButton color="secondary">
                            <NotificationsIcon />
                        </IconButton> */}
                        <SettingsMenu />
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
                <NavList visible={true} navSelected={navSelected} navItems={mainNav} />
                <Divider />
                <NavList
                    visible={user.role === 'admin'}
                    navSelected={navSelected}
                    navItems={adminNav}
                />
                <NavList
                    visible={user.role === 'owner'}
                    navSelected={navSelected}
                    navItems={ownerNav}
                />
            </Drawer>
            <Main open={true}>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
};

export default Dashboard;
