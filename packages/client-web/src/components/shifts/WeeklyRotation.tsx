import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import RotationDetails from './RotationDetails';
import CreateWeekRotationForm from 'components/forms/CreateWeekRotationForm';
import PermissionCheck from 'components/auth/PermissionCheck';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import api from 'utils/api';

import { IShiftRotation, IShiftTemplate } from 'coverme-shared';

interface IWeeklyRotationProps {
	rotations: IShiftRotation[];
	shifts: IShiftTemplate[];
	onAddComplete: (shiftRotation: IShiftRotation) => void;
	onDeleteComplet: (shiftRotations: IShiftRotation[]) => void;
}

const WeeklyRotation: React.FC<IWeeklyRotationProps> = ({
	rotations,
	shifts,
	onAddComplete,
	onDeleteComplet,
}) => {
	const [openAddRotation, setOpenAddRotation] = useState<boolean>(false);
	const [openDeleteRotation, setOpenDeleteRotation] = useState<boolean>(false);
	const [deleteSelectedId, setDeleteSelectedId] = useState<string>('');
	const [loadingDeleteRotation, setLoadingDeleteRotation] = useState<boolean>(false);

	const handleCloseAddRotation = () => {
		setOpenAddRotation(false);
	};

	const handleCloseDeleteRotaion = () => {
		setOpenDeleteRotation(false);
	};

	const handleAddComplete = (shiftRotation: IShiftRotation) => {
		onAddComplete(shiftRotation);
		setOpenAddRotation(false);
	};

	const handleDeleteRotation = () => {
		const newRotations = rotations.filter((rot) => rot.id !== deleteSelectedId);

		onDeleteComplet(newRotations);
		setOpenDeleteRotation(false);
		setDeleteSelectedId('');
	};

	const handleOpenDeleteRotation = (id: string) => {
		setDeleteSelectedId(id);
		setOpenDeleteRotation(true);
	};

	const handleConfirmDeleteRotation = () => {
		setLoadingDeleteRotation(true);
		api.get(`shift-rotations/${deleteSelectedId}/delete`)
			.then(() => {
				handleDeleteRotation();
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setLoadingDeleteRotation(false);
			});
	};

	return (
		<>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				<PermissionCheck permissionLevel={1}>
					<Tooltip title="Create Week Rotation">
						<IconButton
							size="large"
							onClick={() => {
								setOpenAddRotation(true);
							}}
						>
							<AddCircleIcon color="primary" fontSize="large" />
						</IconButton>
					</Tooltip>
				</PermissionCheck>
			</Box>
			<RotationDetails rotations={rotations} onDelete={handleOpenDeleteRotation} />
			<FormDialog open={openAddRotation} onClose={handleCloseAddRotation}>
				<CreateWeekRotationForm shifts={shifts} onAddComplete={handleAddComplete} />
			</FormDialog>
			<DeleteConfirmation
				open={openDeleteRotation}
				isLoading={loadingDeleteRotation}
				message="Are you sure you want to delete this rotation?"
				onClose={handleCloseDeleteRotaion}
				onConfirm={handleConfirmDeleteRotation}
			/>
		</>
	);
};

export default WeeklyRotation;
