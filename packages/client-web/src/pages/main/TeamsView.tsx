import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import CreateTeamForm from 'components/forms/CreateTeamForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import PermissionCheck from 'components/auth/PermissionCheck';
import PageLoading from 'components/loading/PageLoading';
import TeamRoster from 'components/teams/TeamRoster';

import api from 'utils/api';

import { ITeam } from 'coverme-shared';

const TeamsView: React.FC = () => {
	const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);
	const [isLoadingDataUpdate, setIsLoadingDataUpdate] = useState<boolean>(false);
	const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
	const [openDeleteTeam, setOpenDeleteTeam] = useState<boolean>(false);
	const [deleteMessage, setDeleteMessage] = useState<string>('');
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<string>('');

	const { enqueueSnackbar } = useSnackbar();

	const handleOpenAddTeam = () => {
		setOpenAddTeam(true);
	};

	const handleOpenDeleteTeam = (selectedTeamName: string) => {
		setDeleteMessage(
			`Are you sure you want to delete ${selectedTeamName ? selectedTeamName : 'this team'}?`
		);
		setSelectedTeam(selectedTeamName);
		setOpenDeleteTeam(true);
	};

	const handleCloseAddTeam = () => {
		setOpenAddTeam(false);
	};

	const handleOnTeamAdd = (teamAdded?: ITeam) => {
		handleCloseAddTeam();

		if (teamAdded) {
			const newTeams = [...teams, teamAdded];
			setTeams(newTeams);
		}
	};

	const handleConfirmDeleteTeam = () => {
		setIsLoadingDataUpdate(true);
		api.get(`teams/${selectedTeam}/delete`)
			.then(() => {
				enqueueSnackbar(`${selectedTeam} successfully deleted.`, {
					variant: 'success',
				});
				handleGetTeams();
			})
			.catch((err) => {
				console.error(err);
				enqueueSnackbar('An error occured, please try again!', {
					variant: 'error',
				});
			})
			.finally(() => {
				setIsLoadingDataUpdate(false);
				handleCloseDeleteTeam();
			});
	};

	const handleCloseDeleteTeam = () => {
		setOpenDeleteTeam(false);
	};

	const handleGetTeams = useCallback(() => {
		api.getAllData<ITeam>(`teams`)
			.then((teams) => {
				console.log(teams);
				setTeams(teams);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setIsLoadingTeams(false);
			});
	}, []);

	useEffect(() => {
		setIsLoadingTeams(true);
		handleGetTeams();
	}, [handleGetTeams]);

	return (
		<>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
				<Typography variant="h1">Teams</Typography>
				<PermissionCheck permissionLevel={2}>
					<Tooltip title="Create Team">
						<IconButton size="large" onClick={handleOpenAddTeam}>
							<AddCircleIcon color="primary" fontSize="large" />
						</IconButton>
					</Tooltip>
				</PermissionCheck>
			</Box>
			{isLoadingTeams ? (
				<>
					<PageLoading />
				</>
			) : (
				<>
					{teams.map((team) => (
						<TeamRoster
							key={team.id}
							team={team}
							onOpenDeleteTeam={handleOpenDeleteTeam}
						/>
					))}
				</>
			)}
			<FormDialog open={openAddTeam} onClose={handleCloseAddTeam}>
				<CreateTeamForm onFinish={handleOnTeamAdd} />
			</FormDialog>
			<DeleteConfirmation
				open={openDeleteTeam}
				message={deleteMessage}
				isLoading={isLoadingDataUpdate}
				onClose={handleCloseDeleteTeam}
				onConfirm={handleConfirmDeleteTeam}
			/>
		</>
	);
};

export default TeamsView;
