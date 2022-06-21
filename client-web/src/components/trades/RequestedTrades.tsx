import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box } from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import { ITradeDisplay } from 'models/Trade';
import { ISelectedAction } from 'models/TableInfo';
import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';

import BasicConfirmation from 'components/dialogs/BasicConfirmation';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';

import axios from 'utils/axios-intance';

interface IRequestedTradesProps {
    tradeRequests: ITradeDisplay[];
    onRequestStatusChange: (id: string, status: 'Approved' | 'Rejected') => void;
}

const RequestedTrades: React.FC<IRequestedTradesProps> = ({
    tradeRequests,
    onRequestStatusChange,
}) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);

    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationTitle, setConfirmationTitle] = useState<string>('');
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');
    const [isAccepting, setIsAccepting] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const handleSelectRequest = (tradeRequest: any | undefined) => {
        if (selected === tradeRequest) {
            setSelected(undefined);
        } else {
            setSelected(tradeRequest);
        }
    };

    const handleOpenAcceptConfirmation = () => {
        setConfirmationTitle('Accept Trade Request?');
        setConfirmationMessage(
            'Are you sure you want to accept this trade request? This will apply immediately.'
        );
        setIsAccepting(true);
        setOpenConfirmation(true);
    };

    const handleAcceptTrade = () => {
        setIsLoading(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${selected}/accept`
            )
            .then(() => {
                onRequestStatusChange(selected, 'Approved');
                setSelected(undefined);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
                setOpenConfirmation(false);
            });
    };

    const handleOpenRejectConfirmation = () => {
        setConfirmationTitle('Reject Trade Request?');
        setConfirmationMessage('Are you sure you want to reject this trade request?');
        setIsAccepting(false);
        setOpenConfirmation(true);
    };

    const handleRejectTrade = () => {
        setIsLoading(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${selected}/reject`
            )
            .then(() => {
                onRequestStatusChange(selected, 'Rejected');
                setSelected(undefined);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
                setOpenConfirmation(false);
            });
    };

    const handleConfirmation = () => {
        if (isAccepting) {
            handleAcceptTrade();
        } else {
            handleRejectTrade();
        }
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Accept Trade',
            permissionLevel: 0,
            icon: <ThumbUpIcon color="primary" fontSize="large" />,
            onClick: handleOpenAcceptConfirmation,
        },
        {
            tooltipTitle: 'Reject Trade',
            permissionLevel: 0,
            icon: <ThumbDownIcon color="primary" fontSize="large" />,
            onClick: handleOpenRejectConfirmation,
        },
    ];

    return (
        <Box>
            <EnhancedTable
                data={tradeRequests}
                id="id"
                title="Incoming Trades"
                headerCells={ProposeTradeHeadCells}
                selected={selected}
                onSelect={handleSelectRequest}
                unSelectedActions={[]}
                selectedActions={selectedActions}
            />
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

export default RequestedTrades;
