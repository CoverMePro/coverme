import React, { useState } from 'react';
import { Box } from '@mui/material';
import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import { ITradeDisplay } from 'models/Trade';

interface IResultTradesProps {
    tradeRequests: ITradeDisplay[];
}

const ResultTrades: React.FC<IResultTradesProps> = ({ tradeRequests }) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);

    const handleSelectRequest = (tradeRequest: any | undefined) => {
        if (selected === tradeRequest) {
            setSelected(undefined);
        } else {
            setSelected(tradeRequest);
        }
    };

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
                selectedActions={[]}
            />
        </Box>
    );
};

export default ResultTrades;
