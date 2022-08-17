import React, { useState, useEffect } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box } from '@mui/material';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { staffSickHeadCells, managerSickHeadCells } from 'models/HeaderCells/SickRequestHeadCells';
import { ISelectedAction } from 'models/TableInfo';
import { ISickDisplay, ISickRequest } from 'models/Sick';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import LinearLoading from 'components/loading/LineraLoading';
import FormDialog from 'components/dialogs/FormDialog';
import CreateSickRequestForm from 'components/forms/CreateSickRequestForm';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';

import { getAddAction } from 'utils/react/table-actions-helper';
import { formatSickDisplay } from 'utils/formatters/display-formatter';
import axios from 'utils/axios-intance';

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

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
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
            .get(`${process.env.REACT_APP_SERVER_API}/sick-requests/${selected}/approve`)
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
                handleCloseConfirmation();
            });
    };

    const handleRejectSickRequest = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/sick-requests/${selected}/reject`)
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
                .get(`${process.env.REACT_APP_SERVER_API}/sick-requests/${user.id!}`)
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
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/sick-requests/from-teams`, {
                    teams: user.teams,
                })
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
    }, [user]);

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
                        user.role === 'staff'
                            ? getAddAction('Request', handleAddSickRequest, 0)
                            : []
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
        </Box>
    );
};

export default SickView;
