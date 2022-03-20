import React, { useState } from 'react';
import { Box } from '@mui/material';

import axios from 'utils/axios-intance';
import { ITradeDisplay } from 'models/Trade';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import { ISelectedAction } from 'models/TableInfo';

import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';

import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

interface IProposedTradesProps {
    tradeRequests: ITradeDisplay[];
}

const ProposedTrades: React.FC<IProposedTradesProps> = ({ tradeRequests }) => {
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
            tooltipTitle: 'Cancel Request',
            permissionLevel: 0,
            icon: <CancelScheduleSendIcon color="primary" fontSize="large" />,
            onClick: () => {},
        },
    ];

    return (
        <Box>
            <EnhancedTable
                data={tradeRequests}
                id="id"
                title="Proposed Trades"
                headerCells={ProposeTradeHeadCells}
                selected={selected}
                onSelect={handleSelectRequest}
                unSelectedActions={[]}
                selectedActions={selectedActions}
            />
        </Box>
    );
};

export default ProposedTrades;
