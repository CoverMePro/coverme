import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router';

import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Typography, Drawer, Divider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { DRAWER_WIDTH } from '../../constants';

import SettingsMenu from 'components/navigation/SettingsMenu';
import NavList from 'components/navigation/NavList';
import RequestNavList from 'components/navigation/RequestNavList';

import MainSection from './MainSection';

import { adminNav, mainNav, managmentNav, companyNav, overtimeNav } from 'utils/react/navs';

const Dashboard: React.FC = () => {
    const [navSelected, setNavSelected] = useState<number>(0);

    const user = useTypedSelector((state) => state.user);
    const company = useTypedSelector((state) => state.company);
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
                                    <Typography sx={{ mr: 2 }} variant="h6">
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography sx={{ mr: 2 }} variant="body1">
                                        {company.name}
                                    </Typography>
                                </Box>

                                {/* <IconButton color="secondary">
                            <NotificationsIcon />
                        </IconButton> */}
                                <SettingsMenu />
                            </Box>
                        </Box>
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
                            <RequestNavList
                                visible={user.role === 'staff'}
                                navSelected={navSelected}
                            />
                        )}
                        <Divider />
                        <NavList
                            visible={user.role !== 'admin'}
                            navSelected={navSelected}
                            navItems={overtimeNav}
                        />
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
