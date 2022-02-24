import React, { useState } from 'react';

import { Box, Tabs, Tab, Typography } from '@mui/material';

const TradeView: React.FC = () => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box>
            <Typography variant="h2">Trade Requests</Typography>
            <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
                <Tab label="Pending" />
                <Tab label="Confirmed" />
                <Tab label="Denied" />
            </Tabs>
        </Box>
    );
};

export default TradeView;
