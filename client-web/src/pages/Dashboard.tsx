import { useTypedSelector } from 'hooks/use-typed-selector';
import React from 'react';

const Dashboard: React.FC = () => {
	const user = useTypedSelector(state => state.user);

	console.log(user);
	return <div>DASHBOARD</div>;
};

export default Dashboard;
