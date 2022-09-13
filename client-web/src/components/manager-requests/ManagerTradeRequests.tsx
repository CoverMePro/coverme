import React from 'react';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import UndoIcon from '@mui/icons-material/Undo';

import { IFullTradeDisplay } from 'models/Trade';

interface IManagerTradeRequestsProps {
    tradeRequests: IFullTradeDisplay[];
}

const ManagerTradeRequests: React.FC<IManagerTradeRequestsProps> = ({ tradeRequests }) => {
    return (
        <Box
            sx={{
                mt: 2,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            {tradeRequests.map((trade) => (
                <Paper
                    key={trade.id}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h4">{trade.date}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">{trade.proposedUser}</Typography>
                        <Typography variant="h6">{trade.recivingUserShiftTrading}</Typography>
                    </Box>
                    <Box sx={{ cursor: 'help' }}>
                        <Tooltip title="The staff member has received the shift below their name">
                            <SwapHorizIcon color="primary" fontSize="large" />
                        </Tooltip>
                    </Box>
                    <Box>
                        <Typography variant="h6">{trade.receivingUser}</Typography>
                        <Typography variant="h6">{trade.proposedUserShiftTrading}</Typography>
                    </Box>
                    <Box>
                        <Tooltip title="Undo Trade">
                            <IconButton>
                                <UndoIcon color="primary" fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default ManagerTradeRequests;
