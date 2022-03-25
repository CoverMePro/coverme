import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';

import ArchiveIcon from '@mui/icons-material/Archive';

import ProposeTradeHeadCells from 'models/HeaderCells/TradeRequestHeadCells';
import { ITradeDisplay } from 'models/Trade';
import { ISelectedAction } from 'models/TableInfo';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import BasicConfirmation from 'components/dialogs/BasicConfirmation';

import axios from 'utils/axios-intance';

interface IResultTradesProps {
    tradeRequests: ITradeDisplay[];
    onRemoveRequest: (id: string) => void;
}

const ResultTrades: React.FC<IResultTradesProps> = ({ tradeRequests, onRemoveRequest }) => {
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showArchive, setShowArchive] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const handleSelectRequest = (tradeRequest: any | undefined) => {
        if (selected === tradeRequest) {
            setSelected(undefined);
        } else {
            setSelected(tradeRequest);
        }
    };

    const selectedActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Acknowledge and Archive',
            permissionLevel: 0,
            icon: <ArchiveIcon color="primary" fontSize="large" />,
            onClick: () => setOpenConfirmation(true),
        },
    ];

    const handleConfirmation = () => {
        setIsLoading(true);
        axios
            .post(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${selected}/archive`,
                { user: user.email! }
            )
            .then(() => {
                setIsLoading(false);
                onRemoveRequest(selected);
                setSelected(undefined);
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            })
            .finally(() => {
                setOpenConfirmation(false);
            });
    };

    const filterTrades = (tradeRequests: ITradeDisplay[]) => {
        if (showArchive) {
            return tradeRequests;
        } else {
            const filteredRequests = tradeRequests.filter(
                (tradeRequest) =>
                    !tradeRequest.archiveUsers || !tradeRequest.archiveUsers.includes(user.email!)
            );
            return filteredRequests;
        }
    };

    return (
        <Box>
            <EnhancedTable
                data={filterTrades(tradeRequests)}
                id="id"
                title="Proposed Trades"
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
                title={'Archive Trade Request'}
                message={
                    'Do you want to archive this trade request? you will no longer see this request in this table.'
                }
                onConfirm={handleConfirmation}
            />
        </Box>
    );
};

export default ResultTrades;
