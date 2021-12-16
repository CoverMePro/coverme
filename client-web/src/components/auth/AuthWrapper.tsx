import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { useActions } from 'hooks/use-actions';

import axios from 'utils/axios-intance';

interface IAuthWrapperProps {
	permission?: 'manager' | 'admin';
	isOwner?: boolean;
}

const AuthWrapper: React.FC<IAuthWrapperProps> = ({ children, permission, isOwner }) => {
	const [authed, setAuthed] = useState<boolean>(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const user = useTypedSelector(state => state.user);

	const { setUser } = useActions();

	const handlePermissionDenied = () => {
		enqueueSnackbar(
			'You do not have permission to access this content, you have been redirected.',
			{ variant: 'warning' }
		);
		navigate('/login');
	};

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_API}/auth`)
			.then(result => {
				console.log(result.data);
				console.log(user);
				let userData;
				if (!user.email) {
					const retrievedUser = {
						...result.data.user.data,
						email: result.data.user.email
					};

					userData = retrievedUser;
					setUser(retrievedUser);
				} else {
					userData = user;
				}

				console.log(userData);
				if (permission) {
					if (userData.role !== permission) {
						handlePermissionDenied();
					} else {
						if (isOwner) {
							if (!userData.isOwner) {
								handlePermissionDenied();
							}
						}
					}
				}

				setAuthed(true);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	return <>{authed && children}</>;
};

export default AuthWrapper;
