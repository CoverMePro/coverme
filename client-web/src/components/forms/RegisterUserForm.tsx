import React, { useState } from 'react';
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
    Checkbox,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MuiPhoneNumber from 'material-ui-phone-number';
import HowToRegIcon from '@mui/icons-material/Add';
import FormCard from './FormCard';
import { validateUserCreate } from 'utils/validations/user';
import axios from 'utils/axios-intance';

interface IRegisterUserFormProps {
    onFinish: () => void;
}

const RegisterUserForm: React.FC<IRegisterUserFormProps> = ({ onFinish }) => {
    const [role, setRole] = useState<string>('staff');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTestUser, setIsTestUser] = useState<boolean>(false);
    const [savedHireDate, setSavedHireDate] = useState<Date>(new Date());
    const [employeeType, setEmployeeType] = useState<string>('Full-Time');

    const { enqueueSnackbar } = useSnackbar();

    const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole((event.target as HTMLInputElement).value);
    };

    const handleEmployeeTypeChange = (event: SelectChangeEvent) => {
        setEmployeeType(event.target.value as string);
    };

    const { handleSubmit, handleChange, handleBlur, setValues, values, touched, errors } =
        useFormik({
            initialValues: {
                firstName: '',
                lastName: '',
                email: '',
                position: '',
                hireDate: '',
                phone: '',
                password: '',
            },
            validate: validateUserCreate,
            onSubmit: (userValues: any) => {
                const { email, firstName, lastName, password, phone } = userValues;
                console.log('TEST');
                setIsLoading(true);
                if (isTestUser) {
                    axios
                        .post(`${process.env.REACT_APP_SERVER_API}/auth/complete-register`, {
                            email,
                            firstName,
                            lastName,
                            role: role,
                            employeeType: employeeType,
                            hireDate: savedHireDate,
                            password: password,
                            phone: phone,
                        })
                        .then((result) => {
                            setIsLoading(false);
                            enqueueSnackbar('Success! User has been created', {
                                variant: 'success',
                            });
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
                } else {
                    axios
                        .post(`${process.env.REACT_APP_SERVER_API}/auth/register-link`, {
                            email,
                            firstName,
                            lastName,
                            role: role,
                            employeeType: employeeType,
                            hireDate: savedHireDate,
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
                }
            },
        });

    const handleChangeTestUser = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setIsTestUser(checked);
    };

    return (
        <FormCard title=" Register a User">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1">Test User</Typography>
                <Checkbox value={isTestUser} onChange={handleChangeTestUser} />
            </Box>

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
                        error={touched.email && errors.email !== undefined && errors.email !== ''}
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
                            <FormControlLabel value="manager" control={<Radio />} label="Manager" />
                            <FormControlLabel value="staff" control={<Radio />} label="Staff" />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Employee Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={employeeType}
                            label="Employee Type"
                            onChange={handleEmployeeTypeChange}
                        >
                            <MenuItem value="Full-Time">Full-Time</MenuItem>
                            <MenuItem value="Part-Time">Part-Time</MenuItem>
                            <MenuItem value="Temp">Temp</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ mt: 2 }}>
                        <DatePicker
                            renderInput={(props) => (
                                <TextField
                                    {...props}
                                    fullWidth
                                    name="hireDate"
                                    value={values.hireDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                        touched.hireDate &&
                                        errors.hireDate !== undefined &&
                                        errors.hireDate !== ''
                                    }
                                    helperText={touched.hireDate ? errors.hireDate : ''}
                                />
                            )}
                            InputProps={{ readOnly: true }}
                            label="Hire Date"
                            value={savedHireDate}
                            onChange={(newValue, keyboardValue) => {
                                if (newValue && keyboardValue === undefined) {
                                    setSavedHireDate(newValue);
                                    setValues({
                                        ...values,
                                        hireDate: newValue.toString(),
                                    });
                                } else if (keyboardValue !== undefined) {
                                    setValues({
                                        ...values,
                                        hireDate: savedHireDate.toString(),
                                    });
                                }
                            }}
                        />
                    </Box>
                    <>
                        {isTestUser && (
                            <>
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        sx={{ mb: 2, width: '100%' }}
                                        variant="outlined"
                                        label="Password"
                                        type="text"
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
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <MuiPhoneNumber
                                        defaultCountry={'ca'}
                                        disableDropdown
                                        sx={{ mb: 2, width: '40%' }}
                                        variant="outlined"
                                        label="Phone Number"
                                        type="tel"
                                        name="phone"
                                        onChange={(e) => {
                                            setValues({
                                                ...values,
                                                phone: e as string,
                                            });
                                        }}
                                        onBlur={handleBlur}
                                        error={
                                            touched.phone &&
                                            errors.phone !== undefined &&
                                            errors.phone !== ''
                                        }
                                        helperText={touched.phone ? errors.phone : ''}
                                    />
                                </Box>
                            </>
                        )}
                    </>
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
        </FormCard>
    );
};

export default RegisterUserForm;
