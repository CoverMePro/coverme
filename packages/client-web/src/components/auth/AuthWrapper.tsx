import React, { useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useActions } from 'hooks/use-actions';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { IAuthInfo } from 'models/AuthInfo';
import { hasPermission } from 'utils/validations/permissions';
import axios from 'utils/axios-intance';

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
            axios
                .get<IAuthInfo>(`${process.env.REACT_APP_SERVER_API}/auth`)
                .then((authResult) => {
                    setUser(authResult.data.userInfo);
                    setCompany(authResult.data.companyInfo);
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
