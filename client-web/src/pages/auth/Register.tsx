import React, { useState } from 'react';

import {
  Box,
  TextField,
  IconButton,
  Fab,
  InputAdornment,
  Paper,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import loginBackground from '../images/login-background.jpg';
import logo from '../images/cover-me-logo.png';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${loginBackground})`,
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
          <h2>Register a User!</h2>
          <Box>
            <TextField
              sx={{ width: '100%' }}
              variant="outlined"
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Fab color="primary" aria-label="add">
              <LoginIcon fontSize="large" />
            </Fab>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
