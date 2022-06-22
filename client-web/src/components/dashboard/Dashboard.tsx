import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';

import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Toolbar, Typography, Drawer, Divider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { DRAWER_WIDTH } from '../../constants';

import SettingsMenu from 'components/navigation/SettingsMenu';
import NavList from 'components/navigation/NavList';
import RequestNavList from 'components/navigation/RequestNavList';

import AppBar from './AppBar';
import DrawerHeader from './DrawerHeader';
import MainSection from './MainSection';

import { adminNav, mainNav, managmentNav, companyNav, overtimeNav } from 'utils/react/navs';

const Dashboard: React.FC = () => {
    const [navSelected, setNavSelected] = useState<number>(0);

    const user = useTypedSelector((state) => state.user);
    const location = useLocation();

    useEffect(() => {
        const navSelected: any = {
            '/dashboard/home': 0,
            '/dashboard/calendar': 1,
            '/dashboard/schedule': 2,
            '/dashboard/staff': 3,
            '/dashboard/teams': 4,
            '/dashboard/blog': 5,
            '/dashboard/shifts': 6,
            '/dashboard/companies': 7,
            '/dashboard/request/trade': 8,
            '/dashboard/request/time-off': 9,
            '/dashboard/request/sick': 10,
            '/dashboard/overtime': 11,
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
                <DrawerHeader>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        {user.role !== 'admin' ? user.company : 'Admin'}
                    </Typography>
                </DrawerHeader>
                <Divider />
                <NavList
                    visible={user.role === 'admin'}
                    navSelected={navSelected}
                    navItems={adminNav}
                />
                <Divider />
                <NavList
                    visible={user.role !== 'admin'}
                    navSelected={navSelected}
                    navItems={mainNav}
                />
                <Divider />
                <NavList
                    visible={user.role !== 'admin'}
                    navSelected={navSelected}
                    navItems={companyNav}
                />
                <Divider />
                <NavList
                    visible={user.role !== 'staff' && user.role !== 'admin'}
                    navSelected={navSelected}
                    navItems={managmentNav}
                />
                <Divider />
                {user.role !== 'admin' && (
                    <RequestNavList visible={user.role === 'staff'} navSelected={navSelected} />
                )}
                <Divider />
                <NavList
                    visible={user.role !== 'admin'}
                    navSelected={navSelected}
                    navItems={overtimeNav}
                />
            </Drawer>
            <MainSection open={true}>
                <DrawerHeader />
                <Outlet />
            </MainSection>
        </Box>
    );
};

export default Dashboard;
