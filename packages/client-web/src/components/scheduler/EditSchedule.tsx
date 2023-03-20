import React, { useState } from 'react';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import QueueIcon from '@mui/icons-material/Queue';

import FormDialog from 'components/dialogs/FormDialog';
import CreateManualShiftForm from 'components/forms/CreateScheduleShiftForm';

import { IShiftTemplate, IShiftRotation, IScheduleShiftCell } from 'coverme-shared';

interface IEditScheduleProps {
	shiftDefs: IShiftTemplate[];
	rotations: IShiftRotation[];
	isLoadingConfirm: boolean;
	staff: any[];
	hasUpdateTransactions: boolean;
	onConfirmUpdateTransactions: () => void;
}

const EditSchedule: React.FC<IEditScheduleProps> = ({
	rotations,
	shiftDefs,
	isLoadingConfirm,
	staff,
	hasUpdateTransactions,
	onConfirmUpdateTransactions,
}) => {
	const [openCreateShift, setOpenCreatShift] = useState<boolean>(false);

	const handleShiftAdded = () => {
		setOpenCreatShift(false);
	};

	return (
		<Box sx={{ marginBottom: '24px' }}>
			<Box sx={{ display: 'flex', gap: '10px' }}>
				<Box
					sx={{
						display: 'flex',
						gap: '20px',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							gap: '20px',
							alignItems: 'center',
						}}
					></Box>

					<>
						<Box>
							{isLoadingConfirm ? (
								<Box sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
									<CircularProgress size={25} />
								</Box>
							) : (
								<Tooltip title="Confirm Updates" placement="top">
									<span>
										<IconButton
											size="large"
											disabled={!hasUpdateTransactions}
											onClick={onConfirmUpdateTransactions}
										>
											<FactCheckIcon
												color={
													hasUpdateTransactions ? 'primary' : 'disabled'
												}
												fontSize="large"
											/>
										</IconButton>
									</span>
								</Tooltip>
							)}
						</Box>

						<Box>
							<Tooltip title="Schedule Shift" placement="top">
								<IconButton
									disabled={isLoadingConfirm}
									size="large"
									onClick={() => setOpenCreatShift(true)}
								>
									<QueueIcon
										color={isLoadingConfirm ? 'disabled' : 'primary'}
										fontSize="large"
									/>
								</IconButton>
							</Tooltip>
						</Box>
					</>
				</Box>
			</Box>
			<FormDialog open={openCreateShift} onClose={() => setOpenCreatShift(false)}>
				<CreateManualShiftForm
					shiftTemplates={shiftDefs}
					rotations={rotations}
					staff={staff}
					onCompleteAdd={handleShiftAdded}
				/>
			</FormDialog>
		</Box>
	);
};

export default EditSchedule;
