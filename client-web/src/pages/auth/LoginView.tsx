import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { useActions } from 'hooks/use-actions';

import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Fab,
    InputAdornment,
    Paper,
    CircularProgress,
} from '@mui/material';

import { IUser } from 'models/User';

import ForgotPasswordDialog from 'components/dialogs/ForgotPasswordDialog';

import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import loginBackground from '../../images/login-background.jpg';
import logo from '../../images/cover-me-logo.png';

import { validateLogin } from 'utils/validations/auth';

import { AxiosError } from 'axios';
import axios from 'axios';

const LoginView: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLogginIn, setIsLoggingIn] = useState<boolean>(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
    const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string | undefined>(undefined);

    const navigate = useNavigate();
    const { setUser } = useActions();

    const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateLogin,
        onSubmit: (loginValues: any) => {
            const { email, password } = loginValues;
            setIsLoggingIn(true);
            setLoginError(undefined);

            axios
                .post(
                    `${process.env.REACT_APP_SERVER_API}/auth/signin`,
                    {
                        email,
                        password,
                    },
                    { withCredentials: true }
                )
                .then((result) => {
                    const userData: IUser = result.data.user;
                    setUser(userData);
                    setIsLoggingIn(false);
                    navigate('/dashboard/home');
                })
                .catch((err: AxiosError) => {
                    setIsLoggingIn(false);
                    if (err.response?.status === 403) {
                        setLoginError('Your email or password was incorrect.');
                    } else {
                        setLoginError('An unknow error has occured, please try again.');
                    }
                });
        },
    });

    useEffect(() => {
        axios
            .get<IUser>(`${process.env.REACT_APP_SERVER_API}/auth`, {
                withCredentials: true,
            })
            .then((userResult) => {
                setUser(userResult.data);
                navigate('/dashboard');
            })
            .catch((err) => {
                console.error(err);
                setIsCheckingAuth(false);
            });
    }, [navigate, setUser]);

    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    backgroundImage: `url(${loginBackground})`,
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    sx={{
                        width: { xs: '80%', md: 400 },
                        borderRadius: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            paddingY: 5,
                            width: '80%',
                        }}
                    >
                        <img src={logo} width={100} alt="Cover Me Logo" />
                        <Typography variant="h2">Welcome!</Typography>
                        {isCheckingAuth ? (
                            <Box>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                {loginError && (
                                    <Typography sx={{ color: 'error.main' }} variant="body1">
                                        {loginError}
                                    </Typography>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <Box>
                                        <TextField
                                            sx={{ width: '100%' }}
                                            variant="outlined"
                                            type="email"
                                            name="email"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.email &&
                                                errors.email !== undefined &&
                                                errors.email !== ''
                                            }
                                            helperText={touched.email ? errors.email : ''}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            sx={{ width: '100%' }}
                                            variant="outlined"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={
                                                touched.password &&
                                                errors.password !== undefined &&
                                                errors.password !== ''
                                            }
                                            helperText={touched.password ? errors.password : ''}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <IconButton
                                                            sx={{ padding: 0 }}
                                                            onClick={() =>
                                                                setShowPassword(!showPassword)
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff color="primary" />
                                                            ) : (
                                                                <Visibility color="primary" />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            mb: 2,
                                            display: 'flex',
                                            justifyContent: 'end',
                                        }}
                                    >
                                        <Button onClick={() => setOpenForgotPassword(true)}>
                                            Forgot Password
                                        </Button>
                                    </Box>
                                    {isLogginIn ? (
                                        <Box>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Fab color="primary" type="submit" aria-label="Login">
                                                <LoginIcon fontSize="large" />
                                            </Fab>
                                        </Box>
                                    )}
                                </form>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
            <ForgotPasswordDialog
                open={openForgotPassword}
                onClose={() => setOpenForgotPassword(false)}
            />
        </>
    );
};

export default LoginView;
