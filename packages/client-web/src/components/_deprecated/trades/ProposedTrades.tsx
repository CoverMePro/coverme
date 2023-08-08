// import React, { useState } from 'react';
// import { Box } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
// import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
// import api from 'utils/api';

// import { ITradeDisplay, ISelectedAction, staffTradeRequestHeadCells } from 'coverme-shared';

// interface IProposedTradesProps {
// 	tradeRequests: ITradeDisplay[];
// 	onDeleteSuccess: (id: string) => void;
// }

// const ProposedTrades: React.FC<IProposedTradesProps> = ({ tradeRequests, onDeleteSuccess }) => {
// 	const [selected, setSelected] = useState<any | undefined>(undefined);
// 	const [isLoading, setIsLoading] = useState<boolean>(false);
// 	const [openDelete, setOpenDelete] = useState<boolean>(false);

// 	const handleSelectRequest = (tradeRequestId: any | undefined) => {
// 		if (selected === tradeRequestId) {
// 			setSelected(undefined);
// 		} else {
// 			setSelected(tradeRequestId);
// 		}
// 	};

// 	const handleDeleteTradeRequest = () => {
// 		setIsLoading(true);
// 		api.get(`trade-request/${selected}/delete`)
// 			.then(() => {
// 				setIsLoading(false);
// 				onDeleteSuccess(selected);
// 				setSelected(undefined);
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 				setIsLoading(false);
// 			})
// 			.finally(() => {
// 				setOpenDelete(false);
// 			});
// 	};

// 	const selectedActions: ISelectedAction[] = [
// 		{
// 			tooltipTitle: 'Delete Request',
// 			permissionLevel: 0,
// 			icon: <DeleteIcon color="primary" fontSize="large" />,
// 			onClick: () => setOpenDelete(true),
// 		},
// 	];

// 	return (
// 		<Box>
// 			<EnhancedTable
// 				data={tradeRequests}
// 				id="id"
// 				title="Proposed Trades"
// 				headerCells={staffTradeRequestHeadCells}
// 				selected={selected}
// 				onSelect={handleSelectRequest}
// 				unSelectedActions={[]}
// 				selectedActions={selectedActions}
// 			/>
// 			<DeleteConfirmation
// 				open={openDelete}
// 				message={'Are you sure you want to delete this trade request?'}
// 				onClose={() => setOpenDelete(false)}
// 				onConfirm={handleDeleteTradeRequest}
// 				isLoading={isLoading}
// 			/>
// 		</Box>
// 	);
// };

// export default ProposedTrades;

export {};
