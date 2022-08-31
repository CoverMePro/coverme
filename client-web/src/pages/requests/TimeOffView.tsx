import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Typography } from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import {
    staffTimeOffHeadCells,
    managerTimeOffHeadCells,
} from 'models/HeaderCells/TimeOffHeadCells';
import { ITimeOffDisplay, ITimeOffRequest } from 'models/TimeOff';
import { ISelectedAction } from 'models/TableInfo';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import CreateTimeOffForm from 'components/forms/CreateTimeOffForm';
import PageLoading from 'components/loading/PageLoading';
import FormDialog from 'components/dialogs/FormDialog';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';

import { formatTimeOffDisplay } from 'utils/formatters/display-formatter';
import { getAddAction } from 'utils/react/table-actions-helper';
import axios from 'utils/axios-intance';

const TimeOffView: React.FC = () => {
    const [openAddTimeOff, setOpenAddTimeOff] = useState<boolean>(false);
    const [isLoadingTimeOff, setIsLoadingTimeOff] = useState<boolean>(false);

    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [timeOff, setTimeOff] = useState<ITimeOffDisplay[]>([]);

    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationTitle, setConfirmationTitle] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [isApproving, setIsApproving] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const handleSelectTimeOff = (timeOff: any | undefined) => {
        if (selected === timeOff) {
            setSelected(undefined);
        } else {
            setSelected(timeOff);
        }
    };

    const handleAddTimeOff = () => {
        setOpenAddTimeOff(true);
    };

    const handleCloseAddTimeOff = () => {
        setOpenAddTimeOff(false);
    };

    const handleAddTimeOffSuccessfull = (timeOffRequest: ITimeOffRequest | undefined) => {
        if (timeOffRequest) {
            const newTimeOffs = [...timeOff, formatTimeOffDisplay(timeOffRequest)];
            setTimeOff(newTimeOffs);
        }

        handleCloseAddTimeOff();
    };

    const handleOpenApproveTimeOffRequest = () => {
        setConfirmationTitle('Approve Time Off');
        setConfirmationMessage('Are you sure you want to approve this time off?');
        setIsApproving(true);
        setOpenConfirmation(true);
    };

    const handleOpenRejectTimeOffRequest = () => {
        setConfirmationTitle('Reject Time Off');
        setConfirmationMessage('Are you sure you want to reject this time off?');
        setIsApproving(false);
        setOpenConfirmation(true);
    };

    const handleConfirmation = () => {
        if (isApproving) {
            handleApproveTimeOffRequest();
        } else {
            handleRejectTimeOffRequest();
        }
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    const handleApproveTimeOffRequest = () => {
        setIsLoading(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/time-off/${selected}/approve`)
            .then(() => {
                // remove from list for now
                removeTimeOff(selected);
                setSelected(undefined);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
                handleCloseConfirmation();
            });
    };

    const handleRejectTimeOffRequest = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/time-off/${selected}/reject`)
            .then(() => {
                // remove from list for now
                removeTimeOff(selected);
                setSelected(undefined);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
                handleCloseConfirmation();
            });
    };

    const removeTimeOff = (id: string) => {
        const newTimeOff = timeOff.filter((to) => to.id !== id);

        setTimeOff([...newTimeOff]);
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Approve',
            permissionLevel: 0,
            icon: <ThumbUpIcon color="primary" fontSize="large" />,
            onClick: handleOpenApproveTimeOffRequest,
        },
        {
            tooltipTitle: 'Reject',
            permissionLevel: 0,
            icon: <ThumbDownIcon color="primary" fontSize="large" />,
            onClick: handleOpenRejectTimeOffRequest,
        },
    ];

    useEffect(() => {
        setIsLoadingTimeOff(true);
        if (user.role === 'staff') {
            axios
                .get(`${process.env.REACT_APP_SERVER_API}/time-off/${user.id!}`)
                .then((result) => {
                    const timeOffRequests: ITimeOffRequest[] = result.data.timeOffRequests;
                    const timeOffDisplays: ITimeOffDisplay[] = [];

                    timeOffRequests.forEach((timeOff) => {
                        timeOffDisplays.push(formatTimeOffDisplay(timeOff));
                    });

                    setTimeOff([...timeOffDisplays]);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoadingTimeOff(false));
        } else {
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/time-off/from-teams`, {
                    teams: user.teams,
                })
                .then((result) => {
                    const timeOffRequests: ITimeOffRequest[] = result.data.timeOffRequests;
                    const timeOffDisplays: ITimeOffDisplay[] = [];

                    timeOffRequests.forEach((timeOff) => {
                        timeOffDisplays.push(formatTimeOffDisplay(timeOff));
                    });

                    setTimeOff([...timeOffDisplays]);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoadingTimeOff(false));
        }
    }, [user]);

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h1">Leave Requests</Typography>
            </Box>
            {isLoadingTimeOff ? (
                <PageLoading />
            ) : (
                <EnhancedTable
                    headerCells={
                        user.role === 'staff' ? staffTimeOffHeadCells : managerTimeOffHeadCells
                    }
                    id="id"
                    data={timeOff}
                    onSelect={handleSelectTimeOff}
                    selected={selected}
                    unSelectedActions={
                        user.role === 'staff' ? getAddAction('Request', handleAddTimeOff, 0) : []
                    }
                    selectedActions={user.role === 'staff' ? [] : selectedActions}
                />
            )}
            <FormDialog open={openAddTimeOff} onClose={handleCloseAddTimeOff}>
                <CreateTimeOffForm onFinish={handleAddTimeOffSuccessfull} />
            </FormDialog>
            <BasicConfirmation
                open={openConfirmation}
                isLoading={isLoading}
                onClose={handleCloseConfirmation}
                title={confirmationTitle}
                message={confirmationMessage}
                buttons={[
                    { text: 'Cancel', color: 'error', onClick: handleCloseConfirmation },
                    {
                        text: isApproving ? 'Approve' : 'Reject',
                        color: 'primary',
                        onClick: handleConfirmation,
                    },
                ]}
            />
        </>
    );
};

export default TimeOffView;
