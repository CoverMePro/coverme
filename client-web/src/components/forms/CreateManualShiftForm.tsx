import React from 'react';

import { useFormik } from 'formik';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
    Box,
    FormControl,
    InputLabel,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormHelperText,
    Fab,
} from '@mui/material';
import { validateCreateShift } from 'utils/validations/createShift';

import logo from 'images/cover-me-logo.png';
import HowToRegIcon from '@mui/icons-material/Add';
import DurationCustom from 'components/number-formats/DurationCustom';

interface ICreateManualShiftFormProps {
    teamsAndUsers: any;
    onCompleteAdd: (values: any) => void;
}

const CreateManualShiftForm: React.FC<ICreateManualShiftFormProps> = ({
    teamsAndUsers,
    onCompleteAdd,
}) => {
    const { handleSubmit, handleChange, values, setValues, handleBlur, touched, errors } =
        useFormik({
            initialValues: {
                shiftName: '',
                selectedUser: '',
                selectedTeam: '',
                startDate: '',
                shiftDuration: '',
            },
            validate: validateCreateShift,
            onSubmit: (shiftValues: any) => {
                const startDate = new Date(shiftValues.startDate);

                const duration = shiftValues.shiftDuration as string;

                const hour = parseInt(duration.slice(0, 2));
                const minute = parseInt(duration.slice(2));

                const hourmiliseconds = hour * 60 * 60 * 1000;
                const minuteMiliseconds = minute * 60 * 1000;

                const endDate = new Date(startDate.getTime() + hourmiliseconds + minuteMiliseconds);

                onCompleteAdd({
                    startDate: startDate.toUTCString(),
                    endDate: endDate.toUTCString(),
                    user: shiftValues.selectedUser,
                    team: shiftValues.selectedTeam,
                    name: shiftValues.shiftName,
                });
            },
        });

    const getUsersFromTeam = () => {
        return teamsAndUsers.users.filter((user: any) => {
            return user.team === values.selectedTeam;
        });
    };

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
                    Create Shift
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Team</InputLabel>
                            <Select
                                fullWidth
                                name="selectedTeam"
                                value={values.selectedTeam}
                                label="Type"
                                placeholder="select user for shift"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.selectedTeam &&
                                    errors.selectedTeam !== undefined &&
                                    errors.selectedTeam !== ''
                                }
                            >
                                {teamsAndUsers.teams.map((team: string) => {
                                    return (
                                        <MenuItem key={team} value={team}>
                                            {team}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                            <FormHelperText color="error">
                                {touched.selectedTeam ? errors.selectedTeam : ''}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>User</InputLabel>
                            <Select
                                fullWidth
                                name="selectedUser"
                                value={values.selectedUser}
                                label="Type"
                                placeholder="select user for shift"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.selectedUser &&
                                    errors.selectedUser !== undefined &&
                                    errors.selectedUser !== ''
                                }
                            >
                                {getUsersFromTeam().map((user: any) => {
                                    return (
                                        <MenuItem key={user.email} value={user.email}>
                                            {user.email}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                            <FormHelperText>
                                {touched.selectedUser ? errors.selectedUser : ''}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Shift Name"
                            multiline
                            maxRows={4}
                            name="shiftName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.shiftName &&
                                errors.shiftName !== undefined &&
                                errors.shiftName !== ''
                            }
                            helperText={touched.shiftName ? errors.shiftName : ''}
                        />
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ mt: 2 }}>
                            <DateTimePicker
                                disablePast
                                renderInput={(props) => (
                                    <TextField
                                        {...props}
                                        fullWidth
                                        name="startDate"
                                        value={values.startDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                            touched.startDate &&
                                            errors.startDate !== undefined &&
                                            errors.startDate !== ''
                                        }
                                        helperText={touched.startDate ? errors.startDate : ''}
                                    />
                                )}
                                label="Shift Start"
                                value={values.startDate}
                                onChange={(newValue, keyboardValue) => {
                                    if (newValue && keyboardValue === undefined) {
                                        setValues({
                                            ...values,
                                            startDate: newValue.toString(),
                                        });
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                sx={{ width: '50%' }}
                                label="Duration"
                                onChange={handleChange}
                                name="shiftDuration"
                                id="formatted-numberformat-input"
                                InputProps={{
                                    inputComponent: DurationCustom as any,
                                }}
                                onBlur={handleBlur}
                                error={
                                    touched.shiftDuration &&
                                    errors.shiftDuration !== undefined &&
                                    errors.shiftDuration !== ''
                                }
                                helperText={touched.shiftDuration ? errors.shiftDuration : ''}
                                variant="outlined"
                            />
                        </Box>
                    </LocalizationProvider>
                    <Box sx={{ mt: 3 }}>
                        <Fab color="primary" type="submit">
                            <HowToRegIcon fontSize="large" />
                        </Fab>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default CreateManualShiftForm;
