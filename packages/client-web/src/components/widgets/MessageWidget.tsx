import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PageLoading from 'components/loading/PageLoading';
import BoardMessage from 'components/message-board/BoardMessage';
import { IMessage } from 'coverme-shared';
import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';

const MessageWidget: React.FC = () => {
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        setIsLoadingMessages(true);
        axios
            .get<IMessage[]>(`${process.env.REACT_APP_SERVER_API}/messages`)
            .then((messageResults) => {
                setMessages(messageResults.data);
            })
            .catch((err: AxiosError) => {
                console.error(err);
            })
            .finally(() => setIsLoadingMessages(false));
    }, []);

    return (
        <Paper sx={{ width: '100%', height: '100%', overflowY: 'auto', p: 2 }}>
            {isLoadingMessages ? (
                <PageLoading />
            ) : (
                <>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h1">Lastest Messages</Typography>
                    </Box>
                    <Box>
                        {messages.map((message) => (
                            <BoardMessage key={message.id} message={message} />
                        ))}
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default MessageWidget;
