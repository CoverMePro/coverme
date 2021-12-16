import React, { useState, useEffect, useContext } from 'react';
import { SnackbarContext } from 'context/snackbar-context';

import {
  Paper,
  Box,
  TextField,
  Fab,
  FormLabel,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';

import HowToRegIcon from '@mui/icons-material/Add';
import axios from 'axios';

const RegisterUserForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [role, setRole] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { openSnackbar } = useContext(SnackbarContext);

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangeCompany = (
    event: SelectChangeEvent<typeof selectedCompany>
  ) => {
    setSelectedCompany(event.target.value);
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole((event.target as HTMLInputElement).value);
  };

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value);
  };

  const handleRegisterUser = () => {
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_SERVER_API}/auth/register-link`, {
        email,
        firstName,
        lastName,
        company: selectedCompany,
        role,
        position,
      })
      .then((result) => {
        setIsLoading(false);
        openSnackbar(
          'Email sent to use to sign in and complete registration',
          'success'
        );
      })
      .catch((err) => {
        setIsLoading(false);
        openSnackbar('An error has occured, please try again', 'error');
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/company/get-all`)
      .then((result) => {
        console.log(result.data);
        setCompanies(result.data);
      });
  }, []);

  return (
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
        <h2>Register a User!</h2>
        <Box>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="text"
            label="Fist Name"
            onChange={handleFirstNameChange}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="text"
            label="Last Name"
            onChange={handleLastNameChange}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="email"
            label="Email"
            onChange={handleEmailChange}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select label="Company" onChange={handleChangeCompany}>
              {companies.map((company) => {
                return <MenuItem value={company}>{company}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              row
              name="row-radio-buttons-group"
              onChange={handleChangeRole}
            >
              <FormControlLabel
                value="manager"
                control={<Radio />}
                label="Manager"
              />
              <FormControlLabel
                value="staff"
                control={<Radio />}
                label="Staff"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="text"
            label="Position"
            onChange={handlePositionChange}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Fab
              color="primary"
              aria-label="Register User"
              onClick={handleRegisterUser}
            >
              <HowToRegIcon fontSize="large" />
            </Fab>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterUserForm;
