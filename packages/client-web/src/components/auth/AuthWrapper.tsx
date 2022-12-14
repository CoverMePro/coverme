import React, { useEffect, useState } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { hasPermission } from 'utils/validations/permissions';
import api from 'utils/api';

import { IAuthInfo } from 'coverme-shared';

interface IAuthWrapperProps {
	permissionLevel?: number;
}

const AuthWrapper: React.FC<IAuthWrapperProps> = ({ children, permissionLevel = 0 }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const user = useTypedSelector((state) => state.user);
	const { setUser, setCompany } = useActions();

	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (!user.id) {
			api.getData<IAuthInfo>(`auth`)
				.then((authResult) => {
					setUser(authResult.userInfo);
					setCompany(authResult.companyInfo);
				})
				.catch((err) => {
					console.error(err);
					enqueueSnackbar(
						'There was an error retrieving your credentials, please login again.',
						{ variant: 'error' }
					);

					navigate('/login');
				});
		} else {
			if (hasPermission(permissionLevel, user.role)) {
				setIsAuthenticated(true);
			} else {
				enqueueSnackbar(
					'You do not have permission to access this content, you have been redirected.',
					{ variant: 'warning' }
				);
				navigate('/login');
			}
		}
	}, [user, setUser, setCompany, enqueueSnackbar, navigate, permissionLevel]);

	return <>{isAuthenticated && children}</>;
};

export default AuthWrapper;
