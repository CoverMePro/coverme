import React, { useState, useEffect } from 'react';

import PageLoading from 'components/loading/PageLoading';
import { Box, Typography } from '@mui/material';
import BoardMessage from 'components/message-board/BoardMessage';

const MessageWidget: React.FC = () => {
    const [isLoadingMessages, seIsLoadingMessages] = useState<boolean>(false);

    useEffect(() => {
        seIsLoadingMessages(true);
        setTimeout(() => {
            seIsLoadingMessages(false);
        }, 1000);
    }, []);

    return (
        <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            {isLoadingMessages ? (
                <PageLoading />
            ) : (
                <>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h1">Lastest Messages</Typography>
                    </Box>
                    <Box>
                        <BoardMessage />
                        <BoardMessage />
                        <BoardMessage />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default MessageWidget;
