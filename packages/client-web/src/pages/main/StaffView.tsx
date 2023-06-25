import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Typography } from '@mui/material';

import PageLoading from 'components/loading/PageLoading';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import CreateStaffForm from 'components/forms/CreateStaffForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import { getAddAction, getEditDeleteAction } from 'utils/react/table-actions-helper';
import { formatDateString } from 'utils/formatters/dateTime-formatter';
import api from 'utils/api';

import { IStaff, StaffHeadCells } from 'coverme-shared';

const StaffView: React.FC = () => {
	const [openAddStaff, setOpenAddStaff] = useState<boolean>(false);
	const [openDeleteStaff, setOpenDeleteStaff] = useState<boolean>(false);
	const [openEditStaff, setOpenEditStaff] = useState<boolean>(false);
	const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
	const [isLoadingDeleteStaff, setIsLoadingDeleteStaff] = useState<boolean>(false);
	const [deleteMessage, setDeleteMessage] = useState<string>('');
	const [selected, setSelected] = useState<any | undefined>(undefined);
	const [staff, setStaff] = useState<IStaff[]>([]);

	const { enqueueSnackbar } = useSnackbar();

	const handleSelectStaff = (staff: any | undefined) => {
		if (selected === staff) {
			setSelected(undefined);
		} else {
			setSelected(staff);
		}
	};

	const handleAddStaff = () => {
		setOpenAddStaff(true);
	};

	const getSelectedStaffName = (selectedStaffId: any) => {
		return staff.find((user) => user.id === selectedStaffId);
	};

	const handleOpenDeleteStaff = (selectedStaff: any) => {
		const user = getSelectedStaffName(selectedStaff);
		setDeleteMessage(`Are you sure you want to delete ${user?.firstName} ${user?.lastName}?`);
		setOpenDeleteStaff(true);
	};

	const handleCloseAddStaff = () => {
		setOpenAddStaff(false);
	};

	const handleCloseDeleteStaff = () => {
		setOpenDeleteStaff(false);
	};

	const handleOpenEditStaff = () => {
		setOpenEditStaff(true);
	};

	const handleCloseEditStaff = () => {
		setOpenEditStaff(false);
	};

	const handleConfirmDeleteStaff = () => {
		setIsLoadingDeleteStaff(true);
		api.get(`auth/delete/${selected}`)
			.then(() => {
				enqueueSnackbar('Staff member successfully deleted', { variant: 'success' });
				setSelected(undefined);
				handleGetUsers();
			})
			.catch((err) => {
				enqueueSnackbar('Error trying to delete Staff member, please try again', {
					variant: 'error',
				});
			})
			.finally(() => {
				setOpenDeleteStaff(false);
				setIsLoadingDeleteStaff(false);
			});
	};

	const formatHireDate = (staff: IStaff[]) => {
		return staff.map((user) => {
			const date = user.hireDate;
			user.hireDateDisplay = formatDateString(date! as Date);
			return user;
		});
	};

	const handleGetUsers = useCallback(() => {
		api.getAllData<IStaff>(`staff`)
			.then((staff) => {
				setStaff(formatHireDate(staff));
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => setIsLoadingStaff(false));
	}, []);

	useEffect(() => {
		const loadUsers = async () => {
			setIsLoadingStaff(true);
			await handleGetUsers();
		};

		loadUsers();
	}, [handleGetUsers]);

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<Typography variant="h1">Staff</Typography>
			</Box>
			{isLoadingStaff ? (
				<PageLoading />
			) : (
				<Box>
					<EnhancedTable
						data={staff}
						headerCells={StaffHeadCells}
						id="id"
						selected={selected}
						onSelect={handleSelectStaff}
						unSelectedActions={getAddAction('Staff', handleAddStaff)}
						selectedActions={getEditDeleteAction(
							'Staff',
							handleOpenDeleteStaff,
							handleOpenEditStaff
						)}
					/>
					<FormDialog
						open={openEditStaff ? true : openAddStaff}
						onClose={openEditStaff ? handleCloseEditStaff : handleCloseAddStaff}
					>
						<CreateStaffForm
							editMode={openEditStaff}
							selectedUser={getSelectedStaffName(selected)}
							onFinish={() => {
								handleCloseAddStaff();
								handleCloseEditStaff();
								handleGetUsers();
							}}
						/>
					</FormDialog>
					<DeleteConfirmation
						open={openDeleteStaff}
						message={deleteMessage}
						isLoading={isLoadingDeleteStaff}
						onClose={handleCloseDeleteStaff}
						onConfirm={handleConfirmDeleteStaff}
					/>
				</Box>
			)}
		</>
	);
};

export default StaffView;
