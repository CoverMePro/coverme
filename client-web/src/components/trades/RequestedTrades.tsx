import React, { useState } from 'react';
import { Box } from '@mui/material';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';

import { ITradeDisplay } from 'models/Trade';
import { ISelectedAction } from 'models/TableInfo';
import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';

import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import axios from 'utils/axios-intance';

interface IProposedTradesProps {
    tradeRequests: ITradeDisplay[];
}

const RequestedTrades: React.FC<IProposedTradesProps> = ({ tradeRequests }) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);

    const handleSelectRequest = (tradeRequest: any | undefined) => {
        if (selected === tradeRequest) {
            setSelected(undefined);
        } else {
            setSelected(tradeRequest);
        }
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Accept Trade',
            permissionLevel: 0,
            icon: <ThumbUpIcon color="primary" fontSize="large" />,
            onClick: () => {},
        },
        {
            tooltipTitle: 'Reject Trade',
            permissionLevel: 0,
            icon: <ThumbDownIcon color="primary" fontSize="large" />,
            onClick: () => {},
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
