import React, { useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';
import NavList from './NavList';
import { mainNav, managmentNav, overtimeNav, requestNav } from 'utils/react/navs';
import { getSelectedNavTab } from 'utils/navigation/nav-helper';

const Navigation: React.FC = () => {
    const [navSelected, setNavSelected] = useState<number>(0);

    const user = useTypedSelector((state) => state.user);

    const location = useLocation();

    useEffect(() => {
        setNavSelected(getSelectedNavTab(location.pathname));
    }, [location.pathname]);

    return (
        <>
            <Divider />
            <NavList visible={user.role !== 'admin'} navSelected={navSelected} navItems={mainNav} />
            <Divider />
            <NavList
                visible={user.role !== 'staff'}
                navSelected={navSelected}
                navItems={managmentNav}
            />
            <NavList
                visible={user.role === 'staff'}
                navSelected={navSelected}
                navItems={requestNav}
            />
            <Divider />
            <NavList
                visible={user.role !== 'admin'}
                navSelected={navSelected}
                navItems={overtimeNav}
            />
        </>
    );
};

export default Navigation;
