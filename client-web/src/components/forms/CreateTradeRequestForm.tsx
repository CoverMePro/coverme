import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import {
    Box,
    TextField,
    Fab,
    Checkbox,
    Autocomplete,
    CircularProgress,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';
import axios from 'utils/axios-intance';

import { IUser } from 'models/User';
import { AxiosError } from 'axios';
import { IShift } from 'models/Shift';
import { formatDateTimeOutputString } from 'utils/date-formatter';
import { ITradeRequest } from 'models/Trade';

interface ICreateTradeRequestFromProps {
    onFinish: (tradeRequest: ITradeRequest | undefined) => void;
}

const CreateTradeRequestFrom: React.FC<ICreateTradeRequestFromProps> = ({ onFinish }) => {
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [staff, setStaff] = useState<IUser[]>([]);
    const [userShifts, setUserShifts] = useState<IShift[]>([]);
    const [requestedShifts, setRequestedShifts] = useState<IShift[]>([]);
    const [selectedProposedShiftId, setSelectedProposedShiftId] = useState<string>('');
    const [selectedRequestedUserId, setSelectedRequestedUserId] = useState<string>('');
    const [selectedRequestedShiftId, setSelectedRequestedShiftId] = useState<string>('');

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = () => {
        const tradeRequest: ITradeRequest = {
            proposedDate: new Date(),
            proposedUser: user.email!,
            proposedShiftId: selectedProposedShiftId,
            requestedUser: selectedRequestedUserId,
            requestedShiftId: selectedRequestedShiftId,
            status: 'Pending',
        };

        setIsLoading(true);
        axios
            .post(
                `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/trade-request`,
                tradeRequest
            )
            .then((result) => {
                enqueueSnackbar('Trade request submitted.', {
                    variant: 'success',
                });
                onFinish(result.data.tradeRequest);
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

    const handlePropsedShiftChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        setSelectedProposedShiftId(event.target.value);
    };

    const handleRequestedUserChange = (
        event: React.SyntheticEvent<Element, Event>,
        value: IUser | null
    ) => {
        if (value) {
            setSelectedRequestedUserId(value.email!);
            // get shifts

            axios
                .get(
                    `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/shifts/${
                        value.email
                    }`
                )
                .then((result) => {
                    setRequestedShifts(result.data.shifts);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally();
        } else {
            setSelectedRequestedUserId('');
        }
    };

    const handleRequestedShiftChange = (
        event: SelectChangeEvent<string>,
        child: React.ReactNode
    ) => {
        setSelectedRequestedShiftId(event.target.value);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingData(true);

                const getStaffPromise = axios.get(
                    `${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`
                );
                const getShiftsPromise = axios.get(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/shifts/${user.email!}`
                );

                const [staffResults, shiftResults] = await Promise.all([
                    getStaffPromise,
                    getShiftsPromise,
                ]);

                const staffUsers: IUser[] = staffResults.data.users.filter(
                    (staffUser: IUser) =>
                        staffUser.role === 'staff' && staffUser.email !== user.email
                );
                setStaff(staffUsers);
                setUserShifts(shiftResults.data.shifts);
                setIsLoadingData(false);
            } catch (err) {
                console.error(err);
                setIsLoadingData(false);
            }
        };

        loadData();

        // axios
        //     .get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
        //     .then((result) => {
        //         const staffUsers: IUser[] = result.data.users.filter(
        //             (staffUser: IUser) =>
        //                 staffUser.role === 'staff' && staffUser.email !== user.email
        //         );
        //         setStaff(staffUsers);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
        //     .finally();
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
                    Trade Request
                </Typography>
                <>
                    {isLoadingData ? (
                        <Box>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Box>
                                <FormControl fullWidth>
                                    <InputLabel id="proposed-shift-label">
                                        Your Shift To Trade
                                    </InputLabel>
                                    <Select
                                        labelId="proposed-shift-label"
                                        id="proposed-shift-select"
                                        value={selectedProposedShiftId}
                                        label="Your Shift To Trade"
                                        onChange={handlePropsedShiftChange}
                                    >
                                        {userShifts.map((shift) => {
                                            return (
                                                <MenuItem key={shift.id} value={shift.id}>
                                                    {formatDateTimeOutputString(
                                                        shift.startDateTime,
                                                        shift.endDateTime
                                                    )}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Autocomplete
                                    options={staff}
                                    getOptionLabel={(option) =>
                                        `${option.firstName} ${option.lastName} - ${option.email}`
                                    }
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            {option.firstName} {option.lastName} - {option.email}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Staff to Trade With" />
                                    )}
                                    onChange={handleRequestedUserChange}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="requested-shift-label">
                                        Requested Shift
                                    </InputLabel>
                                    <Select
                                        labelId="requested-shift-label"
                                        id="requested-shift-select"
                                        value={selectedRequestedShiftId}
                                        label="Requested Shift"
                                        onChange={handleRequestedShiftChange}
                                    >
                                        {requestedShifts.map((shift) => {
                                            return (
                                                <MenuItem key={shift.id} value={shift.id}>
                                                    {formatDateTimeOutputString(
                                                        shift.startDateTime,
                                                        shift.endDateTime
                                                    )}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
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

export default CreateTradeRequestFrom;
