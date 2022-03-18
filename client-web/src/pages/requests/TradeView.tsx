import React, { useState, useEffect } from 'react';

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

    const [trades, setTrades] = useState<ITrades>({
        approvedTrades: [],
        declinedTrades: [],
        proposedTrades: [],
        requestedTrades: [],
    });

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

    useEffect(() => {}, []);

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
