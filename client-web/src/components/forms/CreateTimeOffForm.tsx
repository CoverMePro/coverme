import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { ISickRequest } from 'models/Sick';
import { IShift } from 'models/Shift';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';

import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Fab,
    Autocomplete,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';

import { formatDateTimeOutputString } from 'utils/date-formatter';
import { ITimeOffRequest, TimeOffType } from 'models/TimeOff';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface ICreateTimeOffFormProps {
    onFinish: (tradeRequest: ISickRequest | undefined) => void;
}

const CreateTimeOffForm: React.FC<ICreateTimeOffFormProps> = ({ onFinish }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [startDateTime, setStartDateTime] = useState<Date>(new Date());
    const [endDateTime, setEndDateTime] = useState<Date>(new Date());
    const [timeOffType, setTimeOffType] = useState<TimeOffType>('Vacation');
    const [description, setDescription] = useState<string>('');

    const [dayType, setDayType] = useState<'partial' | 'full'>('full');

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleTypeChange = (event: SelectChangeEvent<TimeOffType>, child: React.ReactNode) => {
        setTimeOffType(event.target.value as TimeOffType);
    };

    const handleDescriptionChange = (event: any) => {
        setDescription(event.target.value);
    };

    const handleDayTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changedDayType = (event.target as HTMLInputElement).value as 'partial' | 'full';

        setDayType(changedDayType);
    };

    const handleSubmit = () => {
        const timeOffRequest: ITimeOffRequest = {
            requestDate: new Date(),
            type: timeOffType,
            timeOffStart: startDateTime,
            timeOffEnd: endDateTime,
            userId: user.email!,
            description: description,
            status: 'Pending',
        };

        setIsLoading(true);
        axios
            .post(
                `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/time-off`,
                timeOffRequest
            )
            .then((result) => {
                enqueueSnackbar('Time off submitted.', {
                    variant: 'success',
                });
                onFinish(result.data.timeOffRequest);
            })
            .catch((err: AxiosError) => {
                console.error(err);
                enqueueSnackbar('An error has occured, please try again', {
                    variant: 'error',
                });
                onFinish(undefined);
            })
            .finally(() => {
                setIsLoading(false);
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
                    Time Off
                </Typography>
                <FormControl>
                    <RadioGroup row value={dayType} onChange={handleDayTypeChange}>
                        <FormControlLabel value="partial" control={<Radio />} label="Partial Day" />
                        <FormControlLabel value="full" control={<Radio />} label="Full Day" />
                    </RadioGroup>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                    <FormControl>
                        <InputLabel>Type</InputLabel>
                        <Select value={timeOffType} label="Type" onChange={handleTypeChange}>
                            <MenuItem value={'Vacation'}>Vacation</MenuItem>
                            <MenuItem value={'Lieu'}>Lieu</MenuItem>
                            <MenuItem value={'Floater'}>Floater</MenuItem>
                            <MenuItem value={'Other'}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {dayType === 'full' && (
                        <>
                            <Box sx={{ mt: 2 }}>
                                <DatePicker
                                    renderInput={(props) => <TextField {...props} fullWidth />}
                                    label="Time Off Start"
                                    value={startDateTime}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setStartDateTime(newValue);
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <DatePicker
                                    renderInput={(props) => <TextField {...props} fullWidth />}
                                    label="Time Off End"
                                    value={endDateTime}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setEndDateTime(newValue);
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                    {dayType === 'partial' && (
                        <>
                            <Box sx={{ mt: 2 }}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} fullWidth />}
                                    label="Time Off Start"
                                    value={startDateTime}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setStartDateTime(newValue);
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} fullWidth />}
                                    label="Time Off End"
                                    value={endDateTime}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setEndDateTime(newValue);
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </LocalizationProvider>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        maxRows={4}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </Box>
                <Box sx={{ mt: 3 }}>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Fab color="primary" aria-label="Register User" onClick={handleSubmit}>
                            <HowToRegIcon fontSize="large" />
                        </Fab>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTimeOffForm;
