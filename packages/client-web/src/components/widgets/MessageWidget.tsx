import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';

import PageLoading from 'components/loading/PageLoading';
import BoardMessage from 'components/message-board/BoardMessage';
import api from 'utils/api';

import { IMessage } from 'coverme-shared';

const MessageWidget: React.FC = () => {
	const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
	const [messages, setMessages] = useState<IMessage[]>([]);

	useEffect(() => {
		setIsLoadingMessages(true);
		api.getAllData<IMessage>(`messages`)
			.then((messageResults) => {
				setMessages(messageResults);
			})
			.catch((err) => {
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
