import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import {
    Box,
    TextField,
    Fab,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    Typography,
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';
import { validateUserCreate } from 'utils/validation';
import axios from 'utils/axios-intance';

interface IRegisterUserFormProps {
    onFinish: () => void;
}

/**
 * Form use to initially register user to the databse
 * User then must follow email instructions to complete registration
 */

const RegisterUserForm: React.FC<IRegisterUserFormProps> = ({ onFinish }) => {
    const [role, setRole] = useState<string>('staff');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hireDate, setHireDate] = useState<Date>(new Date());

    const company = useTypedSelector((state) => state.user.company);

    const { enqueueSnackbar } = useSnackbar();

    const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole((event.target as HTMLInputElement).value);
    };

    const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            position: '',
            hireDate: '',
        },
        validate: validateUserCreate,
        onSubmit: (userValues: any) => {
            const { email, firstName, lastName, position } = userValues;

            console.log(hireDate);

            setIsLoading(true);
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/auth/register-link`, {
                    email,
                    firstName,
                    lastName,
                    company: company!,
                    role: role,
                    position,
                    hireDate: hireDate,
                })
                .then((result) => {
                    setIsLoading(false);
                    enqueueSnackbar(
                        'Success! an email has been sent out to this user to complete registration.',
                        {
                            variant: 'success',
                        }
                    );
                    onFinish();
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                    enqueueSnackbar('An error has occured, please try again', {
                        variant: 'error',
                    });
                    onFinish();
                });
        },
    });

    return (
        <Box
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
                <img src={logo} width={100} alt="Cover Me Logo" />
                <Typography sx={{ mb: 2 }} variant="h2">
                    Register a User!
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                            sx={{ width: '100%' }}
                            variant="outlined"
                            type="text"
                            name="firstName"
                            label="Fist Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.firstName &&
                                errors.firstName !== undefined &&
                                errors.firstName !== ''
                            }
                            helperText={touched.firstName ? errors.firstName : ''}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            sx={{ width: '100%' }}
                            variant="outlined"
                            type="text"
                            name="lastName"
                            label="Last Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.lastName &&
                                errors.lastName !== undefined &&
                                errors.lastName !== ''
                            }
                            helperText={touched.lastName ? errors.lastName : ''}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            sx={{ width: '100%' }}
                            variant="outlined"
                            type="email"
                            name="email"
                            label="Email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.email && errors.email !== undefined && errors.email !== ''
                            }
                            helperText={touched.email ? errors.email : ''}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                name="row-radio-buttons-group"
                                onChange={handleChangeRole}
                                defaultValue="staff"
                            >
                                <FormControlLabel
                                    value="manager"
                                    control={<Radio />}
                                    label="Manager"
                                />
                                <FormControlLabel value="staff" control={<Radio />} label="Staff" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            sx={{ width: '100%' }}
                            variant="outlined"
                            type="text"
                            name="position"
                            label="Position"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.position &&
                                errors.position !== undefined &&
                                errors.position !== ''
                            }
                            helperText={touched.position ? errors.position : ''}
                        />
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ mt: 2 }}>
                            <DatePicker
                                renderInput={(props) => <TextField {...props} fullWidth />}
                                label="Hire Date"
                                value={hireDate}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setHireDate(newValue);
                                    }
                                }}
                            />
                        </Box>
                    </LocalizationProvider>

                    <Box sx={{ mt: 3 }}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Fab color="primary" aria-label="Register User" type="submit">
                                <HowToRegIcon fontSize="large" />
                            </Fab>
                        )}
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default RegisterUserForm;
