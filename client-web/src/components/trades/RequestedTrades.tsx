import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';

import { ITradeDisplay } from 'models/Trade';
import { ISelectedAction } from 'models/TableInfo';
import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

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

    const user = useTypedSelector((state) => state.user);

    const handleSelectRequest = (tradeRequest: any | undefined) => {
        if (selected === tradeRequest) {
            setSelected(undefined);
        } else {
            setSelected(tradeRequest);
        }
    };

    const handleAcceptTrade = (id: any) => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${id}/accept`
            )
            .then(() => {
                onRequestStatusChange(id, 'Approved');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRejectTrade = (id: any) => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${id}/reject`
            )
            .then(() => {
                onRequestStatusChange(id, 'Rejected');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Accept Trade',
            permissionLevel: 0,
            icon: <ThumbUpIcon color="primary" fontSize="large" />,
            onClick: handleAcceptTrade,
        },
        {
            tooltipTitle: 'Reject Trade',
            permissionLevel: 0,
            icon: <ThumbDownIcon color="primary" fontSize="large" />,
            onClick: handleRejectTrade,
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
        </Box>
    );
};

export default RequestedTrades;
