import React, { useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

const Dashboard: React.FC = () => {
	const user = useTypedSelector(state => state.user);

	useEffect(() => {}, []);

	console.log(user);
	return <div>DASHBOARD</div>;
};

export default Dashboard;
