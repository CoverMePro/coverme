import React, { useState, useEffect, useCallback } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import PageLoading from 'components/loading/PageLoading';
import BoardMessage from 'components/message-board/BoardMessage';
import PermissionCheck from 'components/auth/PermissionCheck';
import FormDialog from 'components/dialogs/FormDialog';
import CreateMessageForm from 'components/forms/CreateMessageForm';
import DataFilter from 'components/shared/DataFilter';
import api from 'utils/api';

import { IMessage } from 'coverme-shared';

const BlogView: React.FC = () => {
	const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
	const [openAddMessage, setOpenAddMessage] = useState<boolean>(false);

	const [messages, setMessages] = useState<IMessage[]>([]);
	const [filteredMessages, setFilteredMessages] = useState<IMessage[]>([]);

	const [filter, setFilter] = useState<string>('all');

	const user = useTypedSelector((state) => state.user);

	const handleOpenAddMessage = () => {
		setOpenAddMessage(true);
	};

	const handleCloseAddMessage = () => {
		setOpenAddMessage(false);
	};

	const handleAddMessage = (message?: IMessage) => {
		if (message) {
			const newMessages = [message, ...messages];
			setMessages(newMessages);
			setFilteredMessages(filterMessages(newMessages, filter));
		}

		handleCloseAddMessage();
	};

	const filterMessages = useCallback(
		(incomingMessages: IMessage[], filterValue: string) => {
			const newMessages: IMessage[] = [];

			incomingMessages.forEach((message) => {
				if (filterValue === 'teams' || filterValue === 'all') {
					if (user.teams.findIndex((team) => team === message.for) !== -1) {
						newMessages.push(message);
					}
				}

				if (filterValue === 'company' || filterValue === 'all') {
					if (message.for === 'company') {
						newMessages.push(message);
					}
				}
			});

			return newMessages;
		},
		[user.teams]
	);

	const handleFilterChange = (filterValue: string) => {
		console.log(filterValue);
		setFilter(filterValue);
		setFilteredMessages(filterMessages(messages, filterValue));
	};

	useEffect(() => {
		setIsLoadingMessages(true);
		api.getAllData<IMessage>(`messages`)
			.then((messageResults) => {
				setMessages(messageResults);
				setFilteredMessages(filterMessages(messageResults, 'all'));
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => setIsLoadingMessages(false));
	}, [filterMessages]);

	return (
		<>
			<Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Typography variant="h1">Message Board</Typography>
					<DataFilter
						filterValue={filter}
						onFilterChange={handleFilterChange}
						extraOptions={[{ value: 'all', label: 'All', show: true }]}
					/>
				</Box>

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
						{filteredMessages.map((message) => (
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
