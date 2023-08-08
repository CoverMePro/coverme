import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Typography } from '@mui/material';

import PageLoading from 'components/loading/PageLoading';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import { getAddAction, getEditDeleteAction } from 'utils/react/table-actions-helper';
import api from 'utils/api';

import { IUser } from 'coverme-shared';
import { UserHeadCells } from 'coverme-shared/lib/interfaces/models/header-cells/UserHeadCells';
import RegisterUserForm from 'components/forms/RegisterUserForm';

const UserView: React.FC = () => {
	const [openAddUser, setOpenAddUser] = useState<boolean>(false);
	const [openDeleteUser, setOpenDeleteUser] = useState<boolean>(false);
	const [openEditUser, setOpenEditUser] = useState<boolean>(false);
	const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
	const [isLoadingDeleteUser, setIsLoadingDeleteUser] = useState<boolean>(false);
	const [deleteMessage, setDeleteMessage] = useState<string>('');
	const [selected, setSelected] = useState<any | undefined>(undefined);
	const [users, setUsers] = useState<IUser[]>([]);

	const { enqueueSnackbar } = useSnackbar();

	const handleSelectUser = (staff: any | undefined) => {
		if (selected === staff) {
			setSelected(undefined);
		} else {
			setSelected(staff);
		}
	};

	const handleEditUser = () => {
		setOpenEditUser(true);
	};

	const handleAddUser = () => {
		setOpenAddUser(true);
	};

	const getSelectedUserName = (selectedUserId: any) => {
		return users.find((user) => user.id === selectedUserId);
	};

	const handleOpenDeleteUser = (selectedUser: any) => {
		const user = getSelectedUserName(selectedUser);
		setDeleteMessage(`Are you sure you want to delete ${user?.firstName} ${user?.lastName}?`);
		setOpenDeleteUser(true);
	};

	const handleCloseAddUser = () => {
		setOpenAddUser(false);
	};

	const handleCloseEditUser = () => {
		setOpenEditUser(false);
	};

	const handleCloseDeleteUser = () => {
		setOpenDeleteUser(false);
	};

	const handleConfirmDeleteUser = () => {
		setIsLoadingDeleteUser(true);
		api.get(`auth/delete/${selected}`)
			.then(() => {
				enqueueSnackbar('User member successfully deleted', { variant: 'success' });
				setSelected(undefined);
				handleGetUsers();
			})
			.catch((err) => {
				enqueueSnackbar('Error trying to delete User member, please try again', {
					variant: 'error',
				});
			})
			.finally(() => {
				setOpenDeleteUser(false);
				setIsLoadingDeleteUser(false);
			});
	};

	const handleGetUsers = useCallback(() => {
		api.getAllData<IUser>(`users`)
			.then((users) => {
				setUsers(users);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => setIsLoadingUser(false));
	}, []);

	useEffect(() => {
		const loadUsers = async () => {
			setIsLoadingUser(true);
			await handleGetUsers();
		};

		loadUsers();
	}, [handleGetUsers]);

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<Typography variant="h1">Users</Typography>
			</Box>
			{isLoadingUser ? (
				<PageLoading />
			) : (
				<Box>
					<EnhancedTable
						data={users}
						headerCells={UserHeadCells}
						id="id"
						selected={selected}
						onSelect={handleSelectUser}
						unSelectedActions={getAddAction('User', handleAddUser)}
						selectedActions={getEditDeleteAction(
							'User',
							handleOpenDeleteUser,
							handleEditUser
						)}
					/>
					<FormDialog
						open={openEditUser ? true : openAddUser}
						onClose={openEditUser ? handleCloseEditUser : handleCloseAddUser}
					>
						<RegisterUserForm
							editMode={openEditUser}
							selectedUser={getSelectedUserName(selected)}
							onFinish={() => {
								openEditUser ? handleCloseEditUser() : handleCloseAddUser();
								handleGetUsers();
							}}
						/>
					</FormDialog>
					<DeleteConfirmation
						open={openDeleteUser}
						message={deleteMessage}
						isLoading={isLoadingDeleteUser}
						onClose={handleCloseDeleteUser}
						onConfirm={handleConfirmDeleteUser}
					/>
				</Box>
			)}
		</>
	);
};

export default UserView;
