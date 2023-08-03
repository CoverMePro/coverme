import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Autocomplete,
	TextField,
	CircularProgress,
	Button,
} from '@mui/material';

import api from 'utils/api';

import { IStaff, IUser } from 'coverme-shared';

interface IAddUserDialogProps {
	open: boolean;
	teamName: string;
	membersToAdd: IUser[] | IStaff[];
	onAddComplete: (data: IUser | IStaff, isStaff: boolean) => void;
	onDialogClose: () => void;
	isStaff: boolean;
}

const AddUserToTeamDialog: React.FC<IAddUserDialogProps> = ({
	open,
	teamName,
	membersToAdd,
	onAddComplete,
	onDialogClose,
	isStaff,
}) => {
	const [memberSelectedToAdd, setMemberSelectedToAdd] = useState<IUser | IStaff | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { enqueueSnackbar } = useSnackbar();

	const handleSelectUserToAdd = (selectMember: IUser | IStaff | null) => {
		if (selectMember) {
			setMemberSelectedToAdd(selectMember);
		} else {
			setMemberSelectedToAdd(undefined);
		}
	};

	const handleAddUserToTeam = () => {
		setIsLoading(true);
		if (memberSelectedToAdd) {
			let apiCall;
			if (isStaff) {
				apiCall = api.post(`teams/${teamName}/add-staff`, {
					staff: memberSelectedToAdd,
				});
			} else {
				apiCall = api.post(`teams/${teamName}/add-user`, {
					user: memberSelectedToAdd,
				});
			}
			apiCall
				.then(() => {
					enqueueSnackbar(`User added to ${teamName}`, {
						variant: 'success',
					});

					onAddComplete(memberSelectedToAdd, isStaff);
				})
				.catch((err) => {
					enqueueSnackbar('An error occured, please try again!', {
						variant: 'error',
					});
					console.error(err);

					onDialogClose();
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<Dialog open={open} onClose={onDialogClose}>
			<DialogTitle>Add to {teamName}</DialogTitle>
			<DialogContent>
				<Autocomplete
					sx={{ mt: 2 }}
					disablePortal
					options={membersToAdd as any[]}
					getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
					onChange={(e, val) => {
						handleSelectUserToAdd(val);
					}}
					renderInput={(params: any) => (
						<TextField {...params} variant="outlined" label="User" />
					)}
				/>
				<DialogActions sx={{ mt: 2 }}>
					{isLoading ? (
						<CircularProgress sx={{ mb: 1, mr: 1 }} size={25} />
					) : (
						<>
							<Button color="error" onClick={onDialogClose}>
								Cancel
							</Button>
							<Button onClick={handleAddUserToTeam}>Add</Button>
						</>
					)}
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default AddUserToTeamDialog;
