import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import { staffSickHeadCells, managerSickHeadCells } from 'models/HeaderCells/SickRequestHeadCells';

import { formatSickDisplay } from 'utils/display-formatter';

import { ISickDisplay, ISickRequest } from 'models/Sick';
import { getAddAction } from 'utils/table-actions-helper';
import LinearLoading from 'components/loading/LineraLoading';
import FormDialog from 'components/dialogs/FormDialog';
import CreateSickRequestForm from 'components/forms/CreateSickRequestForm';
import axios from 'utils/axios-intance';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ISelectedAction } from 'models/TableInfo';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';

const SickView: React.FC = () => {
    const [openAddSickRequest, setOpenAddSickRequest] = useState<boolean>(false);
    const [isLoadingSickRequest, setIsLoadingSickRequest] = useState<boolean>(false);

    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [sickRequests, setSickRequests] = useState<ISickDisplay[]>([]);

    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationTitle, setConfirmationTitle] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [isApproving, setIsApproving] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const handleSelectSickRequest = (sickRequest: any | undefined) => {
        if (selected === sickRequest) {
            setSelected(undefined);
        } else {
            setSelected(sickRequest);
        }
    };

    const handleAddSickRequest = () => {
        setOpenAddSickRequest(true);
    };

    const handleCloseAddSickRequest = () => {
        setOpenAddSickRequest(false);
    };

    const handleAddSickRequestSuccessfull = (sickRequest: ISickRequest | undefined) => {
        if (sickRequest) {
            console.log(sickRequest);
            const newSickRequests = [...sickRequests, formatSickDisplay(sickRequest)];
            setSickRequests(newSickRequests);
        }

        handleCloseAddSickRequest();
    };

    const removeSickRequest = (id: string) => {
        const newSickRequests = sickRequests.filter((sick) => sick.id !== id);

        setSickRequests([...newSickRequests]);
    };

    const handleConfirmation = () => {
        if (isApproving) {
            handleApproveSickRequest();
        } else {
            handleRejectSickRequest();
        }
    };

    const handleOpenApproveTimeOffRequest = () => {
        setConfirmationTitle('Approve Sick Request');
        setConfirmationMessage('Are you sure you want to approve this sick request?');
        setIsApproving(true);
        setOpenConfirmation(true);
    };

    const handleOpenRejectTimeOffRequest = () => {
        setConfirmationTitle('Reject Sick Request');
        setConfirmationMessage('Are you sure you want to reject this sick request?');
        setIsApproving(false);
        setOpenConfirmation(true);
    };

    const handleApproveSickRequest = () => {
        setIsLoading(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/sick-request/${selected}/approve`
            )
            .then(() => {
                // remove from list for now
                removeSickRequest(selected);
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

    const handleRejectSickRequest = () => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/sick-request/${selected}/reject`
            )
            .then(() => {
                // remove from list for now
                removeSickRequest(selected);
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
        setIsLoadingSickRequest(true);

        if (user.role === 'staff') {
            axios
                .get(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/sick-request/${user.email!}`
                )
                .then((result) => {
                    const sickRequests: ISickRequest[] = result.data.sickRequests;
                    const sickDisplay: ISickDisplay[] = [];

                    sickRequests.forEach((sickRequest) => {
                        sickDisplay.push(formatSickDisplay(sickRequest));
                    });

                    setSickRequests([...sickDisplay]);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoadingSickRequest(false));
        } else {
            console.log('MANAGER');
            axios
                .post(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/sick-request/from-teams`,
                    {
                        teams: user.teams,
                    }
                )
                .then((result) => {
                    const sickRequests: ISickRequest[] = result.data.sickRequests;
                    const sickDisplay: ISickDisplay[] = [];

                    sickRequests.forEach((sickRequest) => {
                        sickDisplay.push(formatSickDisplay(sickRequest));
                    });

                    setSickRequests([...sickDisplay]);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoadingSickRequest(false));
        }
    }, [user.company, user.email]);

    return (
        <Box>
            {isLoadingSickRequest ? (
                <Box>
                    <LinearLoading />
                </Box>
            ) : (
                <EnhancedTable
                    title="Sick Requests"
                    headerCells={user.role === 'staff' ? staffSickHeadCells : managerSickHeadCells}
                    id="id"
                    data={sickRequests}
                    onSelect={handleSelectSickRequest}
                    selected={selected}
                    unSelectedActions={
                        user.role === 'staff' ? getAddAction(handleAddSickRequest, 0) : []
                    }
                    selectedActions={user.role === 'staff' ? [] : selectedActions}
                />
            )}
            <FormDialog open={openAddSickRequest} onClose={handleCloseAddSickRequest}>
                <CreateSickRequestForm onFinish={handleAddSickRequestSuccessfull} />
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
    );
};

export default SickView;
