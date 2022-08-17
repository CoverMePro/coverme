import React, { useState, useEffect } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { ISickRequest } from 'models/Sick';

import { Box, Typography, CircularProgress, Fab, Autocomplete, TextField } from '@mui/material';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';

import { IShift } from 'models/Shift';

import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
import { getTodayAndTomorrowDates } from 'utils/helpers/dateTime-helpers';
import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';

interface ICreateSickRequestFromProps {
    onFinish: (tradeRequest: ISickRequest | undefined) => void;
}

const CreateSickRequestForm: React.FC<ICreateSickRequestFromProps> = ({ onFinish }) => {
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(undefined);
    const [userShifts, setUserShifts] = useState<IShift[]>([]);

    const [error, setError] = useState<string | undefined>(undefined);

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = () => {
        if (selectedShiftId) {
            const sickRequest: ISickRequest = {
                requestDate: new Date(),
                userId: user.id,
                user: `${user.firstName} ${user.lastName}`,
                shiftId: selectedShiftId,
                status: 'Pending',
            };

            setIsLoading(true);
            setError(undefined);
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/sick-requests`, sickRequest)
                .then((result) => {
                    enqueueSnackbar('Sick request submitted.', {
                        variant: 'success',
                    });
                    onFinish(result.data.sickRequest);
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 403) {
                        setError('A sick request for this shift has already been made');
                    } else {
                        console.error(err);
                        enqueueSnackbar('An error has occured, please try again', {
                            variant: 'error',
                        });
                        onFinish(undefined);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setError('A valid shift was not selected');
        }
    };

    const handleShiftChange = (_: React.SyntheticEvent<Element, Event>, value: IShift | null) => {
        if (value) {
            setSelectedShiftId(value.id);
        } else {
            setSelectedShiftId(undefined);
        }
    };

    useEffect(() => {
        setIsLoadingData(true);
        const dates = getTodayAndTomorrowDates();

        axios
            .post(`${process.env.REACT_APP_SERVER_API}/shifts/${user.id!}/range`, {
                startRange: dates.today,
                endRange: dates.tomorrow,
            })
            .then((shiftResults) => {
                setUserShifts(shiftResults.data.shifts);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingData(false);
            });
    }, [user.id]);

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
                    Sick Request
                </Typography>
                <>
                    {isLoadingData ? (
                        <Box>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {userShifts.length > 0 ? (
                                <>
                                    <Box sx={{ mt: 2 }}>
                                        {error && (
                                            <Box sx={{ my: 1 }}>
                                                <Typography sx={{ color: 'red' }} variant="body1">
                                                    {error}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Autocomplete
                                            options={userShifts}
                                            getOptionLabel={(option) =>
                                                `${formatDateTimeOutputString(
                                                    option.startDateTime,
                                                    option.endDateTime
                                                )}`
                                            }
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    {formatDateTimeOutputString(
                                                        option.startDateTime,
                                                        option.endDateTime
                                                    )}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Shift to take off" />
                                            )}
                                            onChange={handleShiftChange}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 3 }}>
                                        {isLoading ? (
                                            <CircularProgress />
                                        ) : (
                                            <Fab
                                                color="primary"
                                                aria-label="Register User"
                                                onClick={handleSubmit}
                                            >
                                                <HowToRegIcon fontSize="large" />
                                            </Fab>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h4">
                                        There are no shifts available for a sick request
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </>
            </Box>
        </Box>
    );
};

export default CreateSickRequestForm;
