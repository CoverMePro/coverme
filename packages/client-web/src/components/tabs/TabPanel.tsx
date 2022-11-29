import { Box } from '@mui/material';
import React from 'react';

interface ITabPanelProps {
    value: number;
    index: number;
}

const TabPanel: React.FC<ITabPanelProps> = ({ value, index, children }) => {
    return <>{value === index && <Box sx={{ width: '100%', height: '100%' }}>{children}</Box>}</>;
};

export default TabPanel;
