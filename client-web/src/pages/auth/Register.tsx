import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';

import {
    Box,
    Paper,
    TextField,
    CircularProgress,
    Fab,
    IconButton,
    InputAdornment,
    Typography,
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoneIcon from '@mui/icons-material/Done';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import onboardBackground from '../../images/onboard-background.jpg';
import logo from '../../images/cover-me-logo.png';

import { validateRegister } from 'utils/validation';
import axios from 'utils/axios-intance';

import MuiPhoneNumber from 'material-ui-phone-number';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const {
        handleSubmit,
        handleChange,
        values,
        setValues,
        validateForm,
        handleBlur,
        touched,
        errors,
    } = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
            phoneNo: '',
        },
        validate: validateRegister,
        onSubmit: (values: any) => {
            setIsLoading(true);
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/auth/register`, {
                    email,
                    password: values.password,
                    phoneNo: values.phoneNo,
                })
                .then(() => {
                    setIsLoading(false);
                    setIsComplete(true);
                })
                .catch((err) => {
                    console.error(err);
                    enqueueSnackbar('An unexpected error has occured, please try again.', {
                        variant: 'error',
                    });
                    setIsLoading(false);
                });
        },
    });

    const handleDone = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const email = searchParams.get('email');
        if (email) {
            setEmail(email);
        } else {
            console.error('EMAIL NOT SET');
        }
    }, [searchParams]);

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                backgroundImage: `url(${onboardBackground})`,
                backgroundSize: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Paper
                sx={{
                    width: { xs: '80%', s: 300, md: 500 },
                    borderRadius: 5,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            mt: 5,
                            mb: 2,
                        }}
                    >
                        <img src={logo} width={100} alt="Cover Me Logo" />
                        {!isComplete && (
                            <Typography variant="h2">Finish registering your account!</Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '80%',
                        }}
                    >
                        <>
                            {isComplete ? (
                                <>
                                    <Typography variant="h3">
                                        Information saved, You are all set!
                                    </Typography>
                                    <Box sx={{ my: 2 }}>
                                        <Fab color="primary" onClick={handleDone}>
                                            <DoneIcon />
                                        </Fab>
                                    </Box>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        sx={{ mb: 2, width: '100%' }}
                                        variant="outlined"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
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
                                    <TextField
                                        sx={{ mb: 2, width: '100%' }}
                                        variant="outlined"
                                        label="Confirm Password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                            touched.confirmPassword &&
                                            errors.confirmPassword !== undefined &&
                                            errors.confirmPassword !== ''
                                        }
                                        helperText={
                                            touched.confirmPassword ? errors.confirmPassword : ''
                                        }
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
                                    <MuiPhoneNumber
                                        defaultCountry={'ca'}
                                        disableDropdown
                                        sx={{ mb: 2, width: '40%' }}
                                        variant="outlined"
                                        label="Phone Number"
                                        type="tel"
                                        name="phoneNo"
                                        onChange={(e) => {
                                            setValues({
                                                ...values,
                                                phoneNo: e as string,
                                            });
                                            validateForm();
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                            touched.phoneNo &&
                                            errors.phoneNo !== undefined &&
                                            errors.phoneNo !== ''
                                        }
                                        helperText={touched.phoneNo ? errors.phoneNo : ''}
                                    />

                                    {isLoading ? (
                                        <Box sx={{ my: 2 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Fab
                                                sx={{ my: 2 }}
                                                color="primary"
                                                type="submit"
                                                aria-label="Next Step"
                                            >
                                                <ArrowForwardIcon fontSize="large" />
                                            </Fab>
                                        </Box>
                                    )}
                                </form>
                            )}
                        </>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Register;
