import React, { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';

import axios from 'utils/axios-intance';

interface IAuthWrapperProps {
    permissionLevel?: number;
}

/**
 *  A wrapper around any page that requires to be authenticated and potentially certain permissions (role)
 */

const AuthWrapper: React.FC<IAuthWrapperProps> = ({ children, permissionLevel = 0 }) => {
    const [authed, setAuthed] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);
    const { setUser } = useActions();

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const hasPermission = useCallback(() => {
        const result: { [key: number]: any } = {
            0: true,
            1: user.role !== 'staff',
            2: user.role !== 'staff' && user.role !== 'manager',
            3: user.role === 'admin',
        };

        return result[permissionLevel] ?? true;
    }, [permissionLevel, user.role]);

    useEffect(() => {
        if (!user.email) {
            axios
                .get(`${process.env.REACT_APP_SERVER_API}/auth`)
                .then((result) => {
                    // This is a check depending if a user enters this page directly and there is no redux state
                    //use the information from the auth check
                    const userData = {
                        ...result.data.user,
                    };

                    setUser(userData);
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
            if (hasPermission()) {
                setAuthed(true);
            } else {
                enqueueSnackbar(
                    'You do not have permission to access this content, you have been redirected.',
                    { variant: 'warning' }
                );
                navigate('/login');
            }
        }
    }, [hasPermission, setUser, user, enqueueSnackbar, navigate]);

    return <>{authed && children}</>;
};

export default AuthWrapper;
