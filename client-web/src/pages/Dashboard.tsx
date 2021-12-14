import React, { useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import axios from 'axios';

const Dashboard: React.FC = () => {
	const user = useTypedSelector(state => state.user);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_API}/company`, { withCredentials: true })
			.then(result => {
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	console.log(user);
	return <div>DASHBOARD</div>;
};

export default Dashboard;
