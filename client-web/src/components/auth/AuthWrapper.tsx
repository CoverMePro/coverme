import React, { useEffect, useState, useCallback } from 'react';

import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';

import { IUser } from 'models/User';

import { hasPermission } from 'utils/permissions';
import axios from 'utils/axios-intance';

interface IAuthWrapperProps {
    permissionLevel?: number;
}

/**
 *  A wrapper around any page that requires to be authenticated and potentially certain permissions (role)
 */

const AuthWrapper: React.FC<IAuthWrapperProps> = ({ children, permissionLevel = 0 }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);
    const { setUser } = useActions();

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const userHasPermission = useCallback(() => {
        return hasPermission(permissionLevel, user.role);
    }, [permissionLevel, user.role]);

    useEffect(() => {
        if (!user.email) {
            axios
                .get<IUser>(`${process.env.REACT_APP_SERVER_API}/auth`)
                .then((userResult) => {
                    setUser(userResult.data);
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
            if (userHasPermission()) {
                setIsAuthenticated(true);
            } else {
                enqueueSnackbar(
                    'You do not have permission to access this content, you have been redirected.',
                    { variant: 'warning' }
                );
                navigate('/login');
            }
        }
    }, [userHasPermission, setUser, user, enqueueSnackbar, navigate]);

    return <>{isAuthenticated && children}</>;
};

export default AuthWrapper;
