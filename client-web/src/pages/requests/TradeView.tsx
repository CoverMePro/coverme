import React, { useState } from 'react';

import { Box, Tabs, Tab, Typography, Tooltip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormDialog from 'components/dialogs/FormDialog';
import CreateTradeRequestFrom from 'components/forms/CreateTradeRequestForm';

const TradeView: React.FC = () => {
    const [tabValue, setTabValue] = useState<number>(0);
    const [openAddTrade, setOpenAddTrade] = useState<boolean>(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenAddTrade = () => {
        setOpenAddTrade(true);
    };

    const handleCloseAddTrade = () => {
        setOpenAddTrade(false);
    };

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
            <FormDialog open={openAddTrade} onClose={handleCloseAddTrade}>
                <CreateTradeRequestFrom onFinish={handleCloseAddTrade} />
            </FormDialog>
        </Box>
    );
};

export default TradeView;
