import React, { useState, useEffect } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';

import { Box, Typography, TextField, CircularProgress, Autocomplete, Fab } from '@mui/material';

import HowToRegIcon from '@mui/icons-material/Add';

import logo from 'images/cover-me-logo.png';

import { IShift } from 'models/Shift';
import { IOvertime } from 'models/Overtime';

import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
import axios from 'utils/axios-intance';

import { AxiosError } from 'axios';

interface ICreateOvertimeCalloutFormProps {
    onFinish: (overtimeCallout: IOvertime | undefined) => void;
}

interface IShiftInfo {
    id: string;
    team: string;
    dateString: string;
}

const CreateOvertimeCalloutForm: React.FC<ICreateOvertimeCalloutFormProps> = ({ onFinish }) => {
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [unassignedShifts, setUnassignedShifts] = useState<IShift[]>([]);
    const [selectedShift, setSelectedShift] = useState<IShiftInfo | undefined>(undefined);

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleShiftChange = (_: React.SyntheticEvent<Element, Event>, value: IShift | null) => {
        if (value) {
            setSelectedShift({
                id: value.id,
                team: value.teamId,
                dateString: formatDateTimeOutputString(value.startDateTime, value.endDateTime),
            });
        } else {
            setSelectedShift(undefined);
        }
    };

    const handleSubmit = () => {
        // TO DO: Handle when a shift already has a callout? - NEEDS TO TEST
        if (selectedShift) {
            const overtimeCallout: IOvertime = {
                company: user.company!,
                shiftId: selectedShift.id,
                shiftInfo: selectedShift.dateString,
                team: selectedShift.team,
                callouts: [],
                status: 'Pending',
            };

            setIsLoading(true);
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/overtime-callouts`, overtimeCallout)
                .then((result) => {
                    enqueueSnackbar('overtime callout created and started.', {
                        variant: 'success',
                    });
                    onFinish(result.data.overtimeCallout);
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 403) {
                        enqueueSnackbar('A callout for this shift has already been made', {
                            variant: 'error',
                        });
                    } else {
                        console.error(err);
                        enqueueSnackbar('An error has occured, please try again', {
                            variant: 'error',
                        });
                    }
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

    useEffect(() => {
        // get unassigned shifts
        setIsLoadingData(true);

        const unclaimedUser = 'unclaimed';
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/shifts/${unclaimedUser}/today`)
            .then((shiftResults) => {
                setUnassignedShifts(shiftResults.data.shifts);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingData(false);
            });
    }, [user.company]);

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
                    Overtime Callout
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
                                    options={unassignedShifts}
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
                                        <TextField {...params} label="Select Unclaimed Shift" />
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

export default CreateOvertimeCalloutForm;
