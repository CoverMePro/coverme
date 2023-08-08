// import React, { useState, useEffect, useCallback } from 'react';

// import { useTypedSelector } from 'hooks/use-typed-selector';

// import { Box, Tabs, Tab, Typography, Tooltip, IconButton } from '@mui/material';

// import AddCircleIcon from '@mui/icons-material/AddCircle';

// import FormDialog from 'components/dialogs/FormDialog';
// import CreateTradeRequestFrom from 'components/forms/CreateTradeRequestForm';
// import TabPanel from 'components/tabs/TabPanel';
// import ProposedTrades from 'components/trades/ProposedTrades';
// import RequestedTrades from 'components/trades/RequestedTrades';
// import ResultTrades from 'components/trades/ResultTrades';
// import PageLoading from 'components/loading/PageLoading';
// import { formatTradeDisplay } from 'utils/formatters/display-formatter';
// import api from 'utils/api';

// import { ITradeDisplay, ITradeRequest } from 'coverme-shared';

// const TradeView: React.FC = () => {
// 	const [tabValue, setTabValue] = useState<number>(0);
// 	const [openAddTrade, setOpenAddTrade] = useState<boolean>(false);
// 	const [isLoading, setIsLoading] = useState<boolean>(false);

// 	const [resultTrades, setResultTrades] = useState<ITradeDisplay[]>([]);
// 	const [proposedTrades, setProposedTrades] = useState<ITradeDisplay[]>([]);
// 	const [requestedTrades, setRequestedTrades] = useState<ITradeDisplay[]>([]);

// 	const user = useTypedSelector((state) => state.user);

// 	const formatTradeRequests = useCallback(
// 		(tradeRequests: ITradeRequest[]) => {
// 			const fetchedResultTrades: ITradeDisplay[] = [];
// 			const fetchedProposedTrades: ITradeDisplay[] = [];
// 			const fetchedRequestedTrades: ITradeDisplay[] = [];

// 			tradeRequests.forEach((tradeRequest) => {
// 				const isProposed = tradeRequest.proposedUserId === user.id;

// 				if (tradeRequest.status === 'Accepted' || tradeRequest.status === 'Rejected') {
// 					fetchedResultTrades.push(formatTradeDisplay(tradeRequest, isProposed));
// 				} else if (isProposed) {
// 					fetchedProposedTrades.push(formatTradeDisplay(tradeRequest, isProposed));
// 				} else if (!isProposed) {
// 					fetchedRequestedTrades.push(formatTradeDisplay(tradeRequest, isProposed));
// 				}
// 			});

// 			setResultTrades(fetchedResultTrades);
// 			setProposedTrades(fetchedProposedTrades);
// 			setRequestedTrades(fetchedRequestedTrades);
// 		},
// 		[user.id]
// 	);

// 	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
// 		setTabValue(newValue);
// 	};

// 	const handleOpenAddTrade = () => {
// 		setOpenAddTrade(true);
// 	};

// 	const handleTradeCreated = (tradeRequest: ITradeRequest | undefined) => {
// 		if (tradeRequest) {
// 			const newProposedTrades = [...proposedTrades, formatTradeDisplay(tradeRequest, true)];

// 			setProposedTrades(newProposedTrades);
// 		}

// 		setOpenAddTrade(false);
// 	};

// 	const handleCloseAddTrade = () => {
// 		setOpenAddTrade(false);
// 	};

// 	const handleRemoveProposedTradeRequest = (id: string) => {
// 		const newProposedTrades = proposedTrades.filter((trade) => trade.id !== id);

// 		setProposedTrades(newProposedTrades);
// 	};

// 	const handleMoveRequestToResults = (id: string, status: 'Approved' | 'Rejected') => {
// 		const tradeRequest = requestedTrades.find((trade) => trade.id === id);

// 		if (tradeRequest) {
// 			tradeRequest.status = status;

// 			const newRequestTrades = requestedTrades.filter((trade) => trade.id !== id);
// 			const newResultTrades = [...resultTrades, tradeRequest];

// 			setRequestedTrades(newRequestTrades);
// 			setResultTrades(newResultTrades);
// 		}
// 	};

// 	const handleRemoveResultRequest = (id: string) => {
// 		const newResultTrades = resultTrades.filter((trade) => trade.id !== id);

// 		setResultTrades(newResultTrades);
// 	};

// 	useEffect(() => {
// 		setIsLoading(true);
// 		api.getAllData<ITradeRequest>(`trade-request/${user.id!}`)
// 			.then((tradeRequests) => {
// 				formatTradeRequests(tradeRequests);
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			})
// 			.finally(() => {
// 				setIsLoading(false);
// 			});
// 	}, [user.id, formatTradeRequests]);

// 	return (
// 		<>
// 			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
// 				<Typography variant="h1">Trade Requests</Typography>
// 				<Tooltip title="Add Trade Request">
// 					<IconButton size="large" onClick={handleOpenAddTrade}>
// 						<AddCircleIcon color="primary" fontSize="large" />
// 					</IconButton>
// 				</Tooltip>
// 			</Box>
// 			{isLoading ? (
// 				<PageLoading />
// 			) : (
// 				<>
// 					<Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
// 						<Tab label="Proposed Trades" />
// 						<Tab label="Incoming Trades" />
// 						<Tab label="Trade Results" />
// 					</Tabs>
// 					<Box>
// 						<TabPanel index={0} value={tabValue}>
// 							<ProposedTrades
// 								tradeRequests={proposedTrades}
// 								onDeleteSuccess={handleRemoveProposedTradeRequest}
// 							/>
// 						</TabPanel>
// 						<TabPanel index={1} value={tabValue}>
// 							<RequestedTrades
// 								tradeRequests={requestedTrades}
// 								onRequestStatusChange={handleMoveRequestToResults}
// 							/>
// 						</TabPanel>
// 						<TabPanel index={2} value={tabValue}>
// 							<ResultTrades
// 								tradeRequests={resultTrades}
// 								onRemoveRequest={handleRemoveResultRequest}
// 							/>
// 						</TabPanel>
// 					</Box>
// 				</>
// 			)}

// 			<FormDialog open={openAddTrade} onClose={handleCloseAddTrade}>
// 				<CreateTradeRequestFrom onFinish={handleTradeCreated} />
// 			</FormDialog>
// 		</>
// 	);
// };

// export default TradeView;

export default {};
