import React, { useState } from 'react';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { ISelectedAction } from 'models/TableInfo';
import { managerTimeOffHeadCells } from 'models/HeaderCells/TimeOffHeadCells';
import { ITimeOffDisplay } from 'models/TimeOff';

import BasicConfirmation from 'components/dialogs/BasicConfirmation';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';

import axios from 'utils/axios-intance';

interface IManagerLeaveRequestsProps {
    leaveRequest: ITimeOffDisplay[];
}

const ManagerLeaveRequests: React.FC<IManagerLeaveRequestsProps> = ({ leaveRequest }) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationTitle, setConfirmationTitle] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [isApproving, setIsApproving] = useState<boolean>(false);

    const handleSelectLeaveRequest = (sickRequest: any | undefined) => {
        if (selected === sickRequest) {
            setSelected(undefined);
        } else {
            setSelected(sickRequest);
        }
    };

    const handleOpenApproveLeaveRequest = () => {
        setConfirmationTitle('Approve Time Off');
        setConfirmationMessage('Are you sure you want to approve this time off?');
        setIsApproving(true);
        setOpenConfirmation(true);
    };

    const handleOpenRejectLeaveRequest = () => {
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
            .get(`${process.env.REACT_APP_SERVER_API}/time-off/${selected}/approve`)
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

    const handleRejectTimeOffRequest = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/time-off/${selected}/reject`)
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

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Approve',
            permissionLevel: 0,
            icon: <ThumbUpIcon color="primary" fontSize="large" />,
            onClick: handleOpenApproveLeaveRequest,
        },
        {
            tooltipTitle: 'Reject',
            permissionLevel: 0,
            icon: <ThumbDownIcon color="primary" fontSize="large" />,
            onClick: handleOpenRejectLeaveRequest,
        },
    ];

    return (
        <>
            <EnhancedTable
                headerCells={managerTimeOffHeadCells}
                id="id"
                data={leaveRequest}
                onSelect={handleSelectLeaveRequest}
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

export default ManagerLeaveRequests;
