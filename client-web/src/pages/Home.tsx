import React from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import ScheduleView from './main/ScheduleView';
import AdminPortal from './admin/AdminPortal';

const Home: React.FC = () => {
    const user = useTypedSelector((state) => state.user);

    return <>{user.role !== 'admin' ? <ScheduleView /> : <AdminPortal />}</>;
};

export default Home;
