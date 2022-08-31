import React, { useState, useEffect } from 'react';

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { IMessage } from 'models/Message';

import PageLoading from 'components/loading/PageLoading';
import BoardMessage from 'components/message-board/BoardMessage';
import PermissionCheck from 'components/auth/PermissionCheck';
import FormDialog from 'components/dialogs/FormDialog';
import CreateMessageForm from 'components/forms/CreateMessageForm';

import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';

const BlogView: React.FC = () => {
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [openAddMessage, setOpenAddMessage] = useState<boolean>(false);

    const [messages, setMessages] = useState<IMessage[]>([]);

    const handleOpenAddMessage = () => {
        setOpenAddMessage(true);
    };

    const handleCloseAddMessage = () => {
        setOpenAddMessage(false);
    };

    const handleAddMessage = (message: IMessage | undefined) => {
        if (message) {
            const newMessages = [message, ...messages];

            setMessages(newMessages);
        }

        handleCloseAddMessage();
    };

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
        <>
            <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h1">Message Board</Typography>
                <PermissionCheck permissionLevel={1}>
                    <Tooltip title="Create Message">
                        <IconButton size="large" onClick={handleOpenAddMessage}>
                            <AddCircleIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </PermissionCheck>
            </Box>
            <>
                {isLoadingMessages ? (
                    <PageLoading />
                ) : (
                    <>
                        {messages.map((message) => (
                            <BoardMessage key={message.id} message={message} />
                        ))}
                    </>
                )}
            </>
            <FormDialog open={openAddMessage} onClose={handleCloseAddMessage}>
                <CreateMessageForm onFinish={handleAddMessage} />
            </FormDialog>
        </>
    );
};

export default BlogView;
