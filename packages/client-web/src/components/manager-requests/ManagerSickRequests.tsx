import React, { useState } from 'react';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { managerSickHeadCells, ISickDisplay, ISelectedAction } from 'coverme-shared';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';
import axios from 'utils/axios-intance';

interface IManagerSickRequestsProps {
    sickRequests: ISickDisplay[];
}

const ManagerSickRequests: React.FC<IManagerSickRequestsProps> = ({ sickRequests }) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationTitle, setConfirmationTitle] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [isApproving, setIsApproving] = useState<boolean>(false);

    const handleSelectSickRequest = (sickRequest: any | undefined) => {
        if (selected === sickRequest) {
            setSelected(undefined);
        } else {
            setSelected(sickRequest);
        }
    };

    const handleOpenApproveSickOffRequest = () => {
        setConfirmationTitle('Approve Sick Request');
        setConfirmationMessage('Are you sure you want to approve this sick request?');
        setIsApproving(true);
        setOpenConfirmation(true);
    };

    const handleOpenRejectSickRequest = () => {
        setConfirmationTitle('Reject Sick Request');
        setConfirmationMessage('Are you sure you want to reject this sick request?');
        setIsApproving(false);
        setOpenConfirmation(true);
    };

    const handleConfirmation = () => {
        if (isApproving) {
            handleApproveSickRequest();
        } else {
            handleRejectSickRequest();
        }
    };

    const handleApproveSickRequest = () => {
        setIsLoading(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/sick-requests/${selected}/approve`)
            .then(() => {
                // remove from list for now
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

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Approve',
            permissionLevel: 0,
            icon: <ThumbUpIcon color="primary" fontSize="large" />,
            onClick: handleOpenApproveSickOffRequest,
        },
        {
            tooltipTitle: 'Reject',
            permissionLevel: 0,
            icon: <ThumbDownIcon color="primary" fontSize="large" />,
            onClick: handleOpenRejectSickRequest,
        },
    ];

    return (
        <>
            <EnhancedTable
                headerCells={managerSickHeadCells}
                id="id"
                data={sickRequests}
                onSelect={handleSelectSickRequest}
                selected={selected}
                unSelectedActions={[]}
                selectedActions={selectedActions}
            />
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

export default ManagerSickRequests;
