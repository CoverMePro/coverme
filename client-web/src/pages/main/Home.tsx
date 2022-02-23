import React from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import ScheduleView from './ScheduleView';
import AdminPortal from '../admin/AdminPortal';

const Home: React.FC = () => {
    const user = useTypedSelector((state) => state.user);

    return <>HOME</>;
};

export default Home;
