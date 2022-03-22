import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';

import { ITradeDisplay } from 'models/Trade';
import { ISelectedAction } from 'models/TableInfo';
import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';

import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

import axios from 'utils/axios-intance';

interface IProposedTradesProps {
    tradeRequests: ITradeDisplay[];
    onDeleteSuccess: (id: string) => void;
}

const ProposedTrades: React.FC<IProposedTradesProps> = ({ tradeRequests, onDeleteSuccess }) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);

    const user = useTypedSelector((state) => state.user);

    const handleSelectRequest = (tradeRequest: any | undefined) => {
        if (selected === tradeRequest) {
            setSelected(undefined);
        } else {
            setSelected(tradeRequest);
        }
    };

    const handleDeleteTradeRequest = (id: any) => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${id}/delete`
            )
            .then(() => {
                onDeleteSuccess(id);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Cancel Request',
            permissionLevel: 0,
            icon: <CancelScheduleSendIcon color="primary" fontSize="large" />,
            onClick: handleDeleteTradeRequest,
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
