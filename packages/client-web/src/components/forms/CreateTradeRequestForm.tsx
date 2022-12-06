import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import {
    Box,
    TextField,
    Fab,
    Autocomplete,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/Add';
import FormCard from './FormCard';
import { ITradeRequest, IUser, IShift } from 'coverme-shared';
import { formatDateTimeOutputString } from 'utils/formatters/dateTime-formatter';
import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';

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
    const [selectedRequestedUser, setSelectedRequestedUserId] = useState<any>(undefined);
    const [selectedRequestedShiftId, setSelectedRequestedShiftId] = useState<string>('');

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    // TO DO: better form validation using what we have! do more research and figure out how to utilize here

    const handleSubmit = () => {
        const tradeRequest: ITradeRequest = {
            proposedDate: new Date(),
            proposedUserId: user.id,
            proposedUser: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            },
            proposedShiftId: selectedProposedShiftId,
            requestedUserId: selectedRequestedUser.id,
            requestedUser: {
                name: selectedRequestedUser.name,
                email: selectedRequestedUser.email,
            },
            requestedShiftId: selectedRequestedShiftId,
            status: 'Pending',
        };

        setIsLoading(true);
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/trade-request`, tradeRequest)
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
        _: React.SyntheticEvent<Element, Event>,
        value: IUser | null
    ) => {
        if (value) {
            setSelectedRequestedUserId({
                id: value.id,
                name: `${value.firstName} ${value.lastName}`,
                email: value.email,
            });
            // get shifts

            axios
                .get(`${process.env.REACT_APP_SERVER_API}/shifts/${value.id}/today`)
                .then((result) => {
                    setRequestedShifts(result.data.shifts);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally();
        } else {
            setSelectedRequestedUserId(undefined);
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

                const getStaffPromise = axios.get(`${process.env.REACT_APP_SERVER_API}/users`);
                const getShiftsPromise = axios.get(
                    `${process.env.REACT_APP_SERVER_API}/shifts/${user.id!}/today`
                );

                const [staffResults, shiftResults] = await Promise.all([
                    getStaffPromise,
                    getShiftsPromise,
                ]);

                const staffUsers: IUser[] = staffResults.data.users.filter(
                    (staffUser: IUser) => staffUser.role === 'staff' && staffUser.id !== user.id
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
    }, [user.id]);

    return (
        <FormCard title="Trade Request">
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
                                                    shift.startDateTime as string,
                                                    shift.endDateTime as string
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
                                <InputLabel id="requested-shift-label">Requested Shift</InputLabel>
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
                                                    shift.startDateTime as string,
                                                    shift.endDateTime as string
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
        </FormCard>
    );
};

export default CreateTradeRequestFrom;
