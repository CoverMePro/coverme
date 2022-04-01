import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { ISickRequest } from 'models/Sick';
import { IShift } from 'models/Shift';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';

import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';
import { Box, Typography, CircularProgress, Fab, Autocomplete, TextField } from '@mui/material';

import { formatDateTimeOutputString } from 'utils/date-formatter';

interface ICreateSickRequestFromProps {
    onFinish: (tradeRequest: ISickRequest | undefined) => void;
}

const CreateSickRequestForm: React.FC<ICreateSickRequestFromProps> = ({ onFinish }) => {
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(undefined);
    const [userShifts, setUserShifts] = useState<IShift[]>([]);

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = () => {
        if (selectedShiftId) {
            const sickRequest: ISickRequest = {
                requestDate: new Date(),
                userId: user.email!,
                shiftId: selectedShiftId,
                status: 'Pending',
            };

            setIsLoading(true);
            axios
                .post(
                    `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/sick-request`,
                    sickRequest
                )
                .then((result) => {
                    enqueueSnackbar('Trade request submitted.', {
                        variant: 'success',
                    });
                    onFinish(result.data.sickRequest);
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
        } else {
            enqueueSnackbar('A valid shift was not selected', {
                variant: 'error',
            });
        }
    };

    const handleShiftChange = (
        event: React.SyntheticEvent<Element, Event>,
        value: IShift | null
    ) => {
        if (value) {
            setSelectedShiftId(value.id);
        } else {
            setSelectedShiftId(undefined);
        }
    };

    useEffect(() => {
        // TO DO: Get only shift from today (and maybe forward)
        axios
            .get(
                `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/shifts/${user.email!}`
            )
            .then((shiftResults) => {
                setUserShifts(shiftResults.data.shifts);
            })
            .catch((err) => {
                console.error(err);
                setIsLoadingData(false);
            });
    }, []);

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
                            <Box sx={{ mt: 2 }}>
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
                                        <TextField {...params} label="Staff to Trade With" />
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
                    )}
                </>
            </Box>
        </Box>
    );
};

export default CreateSickRequestForm;
