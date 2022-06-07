import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import {
    staffTimeOffHeadCells,
    managerTimeOffHeadCells,
} from 'models/HeaderCells/TimeOffHeadCells';

import { formatTimeOffDisplay } from 'utils/display-formatter';

import { getAddAction } from 'utils/table-actions-helper';
import LinearLoading from 'components/loading/LineraLoading';
import FormDialog from 'components/dialogs/FormDialog';
import axios from 'utils/axios-intance';
import { ITimeOffDisplay, ITimeOffRequest } from 'models/TimeOff';
import CreateTimeOffForm from 'components/forms/CreateTimeOffForm';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ISelectedAction } from 'models/TableInfo';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';

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
            console.log(timeOff);
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

    const handleApproveTimeOffRequest = () => {
        setIsLoading(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/time-off/${selected}/approve`
            )
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
                setOpenConfirmation(false);
            });
    };

    const handleRejectTimeOffRequest = () => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/time-off/${selected}/reject`
            )
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
                setOpenConfirmation(false);
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
                .get(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/time-off/${user.email!}`
                )
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
                .post(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/time-off/from-teams`,
                    { teams: user.teams }
                )
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
            <Box>
                {isLoadingTimeOff ? (
                    <Box>
                        <LinearLoading />
                    </Box>
                ) : (
                    <EnhancedTable
                        title="Time Off"
                        headerCells={
                            user.role === 'staff' ? staffTimeOffHeadCells : managerTimeOffHeadCells
                        }
                        id="id"
                        data={timeOff}
                        onSelect={handleSelectTimeOff}
                        selected={selected}
                        unSelectedActions={
                            user.role === 'staff' ? getAddAction(handleAddTimeOff, 0) : []
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
                    onClose={() => setOpenConfirmation(false)}
                    title={confirmationTitle}
                    message={confirmationMessage}
                    onConfirm={handleConfirmation}
                />
            </Box>
        </>
    );
};

export default TimeOffView;
