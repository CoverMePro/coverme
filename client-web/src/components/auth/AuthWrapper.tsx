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

/**
 *  A wrapper around any page that requires to be authenticated and potentially certain permissions (role)
 */

const AuthWrapper: React.FC<IAuthWrapperProps> = ({ children, permission, isOwner }) => {
	const [authed, setAuthed] = useState<boolean>(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const user = useTypedSelector(state => state.user);

	const { setUser } = useActions();

	useEffect(() => {
		if (!user.email) {
			axios
				.get(`${process.env.REACT_APP_SERVER_API}/auth`)
				.then(result => {
					// This is a check depending if a user enters this page directly and there is no redux state
					//use the information from the auth check
					const userData = {
						...result.data.user.data,
						email: result.data.user.email
					};

					setUser(userData);
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			if (permission) {
				if (user.role !== permission && user.role !== 'admin') {
					enqueueSnackbar(
						'You do not have permission to access this content, you have been redirected.',
						{ variant: 'warning' }
					);
					navigate('/login');
				}
			}

			setAuthed(true);
		}
	}, [permission, setUser, user, enqueueSnackbar, navigate]);

	return <>{authed && children}</>;
};

export default AuthWrapper;
