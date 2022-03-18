import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Tabs, Tab, Typography, Tooltip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormDialog from 'components/dialogs/FormDialog';
import CreateTradeRequestFrom from 'components/forms/CreateTradeRequestForm';
import TabPanel from 'components/tabs/TabPanel';
import { ITradeRequest } from 'models/Trade';

import axios from 'utils/axios-intance';

interface ITrades {
    approvedTrades: ITradeRequest[];
    declinedTrades: ITradeRequest[];
    proposedTrades: ITradeRequest[];
    requestedTrades: ITradeRequest[];
}

const TradeView: React.FC = () => {
    const [tabValue, setTabValue] = useState<number>(0);
    const [openAddTrade, setOpenAddTrade] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const [trades, setTrades] = useState<ITrades>({
        approvedTrades: [],
        declinedTrades: [],
        proposedTrades: [],
        requestedTrades: [],
    });

    const formatTradeRequests = (tradeRequests: ITradeRequest[]) => {
        const formattedTrades: ITrades = {
            approvedTrades: [],
            declinedTrades: [],
            proposedTrades: [],
            requestedTrades: [],
        };

        tradeRequests.forEach((tradeRequest) => {
            if (tradeRequest.status === 'Manager Approved') {
                formattedTrades.approvedTrades.push(tradeRequest);
            } else if (tradeRequest.status === 'Manager Denied') {
                formattedTrades.declinedTrades.push(tradeRequest);
            } else if (tradeRequest.proposedUser === user.email) {
                formattedTrades.proposedTrades.push(tradeRequest);
            } else if (tradeRequest.requestedUser === user.email) {
                formattedTrades.requestedTrades.push(tradeRequest);
            }
        });

        setTrades(formattedTrades);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenAddTrade = () => {
        setOpenAddTrade(true);
    };

    const handleTradeCreated = (tradeRequest: ITradeRequest | undefined) => {
        if (tradeRequest) {
            const newTrades = { ...trades };
            newTrades.proposedTrades = [...newTrades.proposedTrades, tradeRequest];

            setTrades(newTrades);
        }

        setOpenAddTrade(false);
    };

    const handleCloseAddTrade = () => {
        setOpenAddTrade(false);
    };

    useEffect(() => {
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/trade-request/${user.email!}`
            )
            .then((result) => {
                const tradeRequests = result.data.tradeRequest;

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
                <Tab label="Outgoing Requests" />
                <Tab label="Incoming Requests" />
                <Tab label="Approved Trades" />
                <Tab label="Rejected Trades" />
            </Tabs>
            <Box>
                <TabPanel index={0} value={tabValue}>
                    Outgoing Requests
                </TabPanel>
                <TabPanel index={1} value={tabValue}>
                    Incoming Requests
                </TabPanel>
                <TabPanel index={2} value={tabValue}>
                    Approved
                </TabPanel>
                <TabPanel index={3} value={tabValue}>
                    Rejected
                </TabPanel>
            </Box>
            <FormDialog open={openAddTrade} onClose={handleCloseAddTrade}>
                <CreateTradeRequestFrom onFinish={handleTradeCreated} />
            </FormDialog>
        </Box>
    );
};

export default TradeView;
