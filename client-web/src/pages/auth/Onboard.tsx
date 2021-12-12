import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';

import {
  Box,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  CircularProgress,
  Fab,
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';

import onboardBackground from '../../images/onboard-background.jpg';
import logo from '../../images/cover-me-logo.png';
import axios from 'axios';
import { validateRegister } from 'utils/validation';

const steps = ['Password', 'Personal Information', 'Upload Photo'];

const Onboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik(
    {
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
            console.log(err);
            setIsLoading(false);
          });
      },
    }
  );

  const handleDone = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setEmail(email);
    } else {
      console.log('EMAIL NOT SET');
    }
  }, []);

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
          width: { xs: '80%', s: 300, md: 600 },
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
              paddingY: 5,
              width: '80%',
            }}
          >
            <img src={logo} width={100} />
            <h2>Finish Registering your account!</h2>
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
                  <h3>Information saved, You are all set!</h3>
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
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.password &&
                      errors.password !== undefined &&
                      errors.password !== ''
                    }
                    helperText={touched.password ? errors.password : ''}
                  />
                  <TextField
                    sx={{ mb: 2, width: '100%' }}
                    variant="outlined"
                    label="Confirm Password"
                    type="password"
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
                  />
                  <TextField
                    sx={{ mb: 2, width: '100%' }}
                    variant="outlined"
                    label="Phone Number"
                    type="tel"
                    name="phoneNo"
                    onChange={handleChange}
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
                    <Fab
                      sx={{ my: 2 }}
                      color="primary"
                      type="submit"
                      aria-label="Next Step"
                    >
                      <ArrowForwardIcon fontSize="large" />
                    </Fab>
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

export default Onboard;
