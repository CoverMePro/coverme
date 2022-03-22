import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Tabs, Tab, Typography, Tooltip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormDialog from 'components/dialogs/FormDialog';
import CreateTradeRequestFrom from 'components/forms/CreateTradeRequestForm';
import TabPanel from 'components/tabs/TabPanel';
import { ITradeDisplay, ITradeRequest } from 'models/Trade';
import formatDisplayTrade from 'utils/trade-display-formatter';

import axios from 'utils/axios-intance';
import ProposedTrades from 'components/trades/ProposedTrades';
import RequestedTrades from 'components/trades/RequestedTrades';
import ResultTrades from 'components/trades/ResultTrades';

const TradeView: React.FC = () => {
    const [tabValue, setTabValue] = useState<number>(0);
    const [openAddTrade, setOpenAddTrade] = useState<boolean>(false);

    const [resultTrades, setResultTrades] = useState<ITradeDisplay[]>([]);
    const [proposedTrades, setProposedTrades] = useState<ITradeDisplay[]>([]);
    const [requestedTrades, setRequestedTrades] = useState<ITradeDisplay[]>([]);

    const user = useTypedSelector((state) => state.user);

    const formatTradeRequests = (tradeRequests: ITradeRequest[]) => {
        const fetchedResultTrades: ITradeDisplay[] = [];
        const fetchedProposedTrades: ITradeDisplay[] = [];
        const fetchedRequestedTrades: ITradeDisplay[] = [];

        tradeRequests.forEach((tradeRequest) => {
            const isProposed = tradeRequest.proposedUser === user.email;

            if (tradeRequest.status === 'Approved' || tradeRequest.status === 'Rejected') {
                fetchedResultTrades.push(formatDisplayTrade(tradeRequest, isProposed));
            } else if (isProposed) {
                fetchedProposedTrades.push(formatDisplayTrade(tradeRequest, isProposed));
            } else if (!isProposed) {
                fetchedRequestedTrades.push(formatDisplayTrade(tradeRequest, isProposed));
            }
        });

        setResultTrades(fetchedResultTrades);
        setProposedTrades(fetchedProposedTrades);
        setRequestedTrades(fetchedRequestedTrades);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenAddTrade = () => {
        setOpenAddTrade(true);
    };

    const handleTradeCreated = (tradeRequest: ITradeRequest | undefined) => {
        if (tradeRequest) {
            const newProposedTrades = [...proposedTrades, formatDisplayTrade(tradeRequest, true)];

            setProposedTrades(newProposedTrades);
        }

        setOpenAddTrade(false);
    };

    const handleCloseAddTrade = () => {
        setOpenAddTrade(false);
    };

    const handleRemoveProposedTradeRequest = (id: string) => {
        const newProposedTrades = proposedTrades.filter((trade) => trade.id !== id);

        setProposedTrades(newProposedTrades);
    };

    const handleMoveRequestToResults = (id: string, status: 'Approved' | 'Rejected') => {
        const tradeRequest = requestedTrades.find((trade) => trade.id === id);

        if (tradeRequest) {
            tradeRequest.status = status;

            const newRequestTrades = requestedTrades.filter((trade) => trade.id !== id);
            const newResultTrades = [...resultTrades, tradeRequest];

            setRequestedTrades(newRequestTrades);
            setResultTrades(newResultTrades);
        }
    };

    useEffect(() => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${user.email!}`
            )
            .then((result) => {
                console.log(result.data);
                const tradeRequests = result.data.tradeRequests;

                formatTradeRequests(tradeRequests);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Trade Requests</Typography>
                <Tooltip title="Add Trade Request">
                    <IconButton size="large" onClick={handleOpenAddTrade}>
                        <AddCircleIcon color="primary" fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
                <Tab label="Proposed Trades" />
                <Tab label="Incoming Trades" />
                <Tab label="Trade Results" />
            </Tabs>
            <Box>
                <TabPanel index={0} value={tabValue}>
                    <ProposedTrades
                        tradeRequests={proposedTrades}
                        onDeleteSuccess={handleRemoveProposedTradeRequest}
                    />
                </TabPanel>
                <TabPanel index={1} value={tabValue}>
                    <RequestedTrades
                        tradeRequests={requestedTrades}
                        onRequestStatusChange={handleMoveRequestToResults}
                    />
                </TabPanel>
                <TabPanel index={2} value={tabValue}>
                    <ResultTrades tradeRequests={resultTrades} />
                </TabPanel>
            </Box>
            <FormDialog open={openAddTrade} onClose={handleCloseAddTrade}>
                <CreateTradeRequestFrom onFinish={handleTradeCreated} />
            </FormDialog>
        </Box>
    );
};

export default TradeView;
