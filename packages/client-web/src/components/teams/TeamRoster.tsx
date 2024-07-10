import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	Box,
	List,
	AccordionActions,
	Tooltip,
	IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SkeletonTeamList from './SkeletonTeamList';

import TeamList from './TeamList';
import PermissionCheck from 'components/auth/PermissionCheck';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import AddUserToTeamDialog from 'components/dialogs/AddUserToTeamDialog';
import api from 'utils/api';

import { ITeam, IUser } from 'coverme-shared';

interface ITeamRosterProps {
	team: ITeam;
	onOpenDeleteTeam: (teamName: string) => void;
}

const TeamRoster: React.FC<ITeamRosterProps> = ({ team, onOpenDeleteTeam }) => {
	const [loadingManagers, setLoadingManagers] = useState<string[]>([]);
	const [loadingStaff, setLoadingStaff] = useState<string[]>([]);
	const [managers, setManagers] = useState<IUser[]>([]);
	const [staff, setStaff] = useState<IUser[]>([]);
	const [teamMembersToAdd, setTeamMembersToAdd] = useState<IUser[]>([]);

	const [expanded, setExpanded] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasLoaded, setHasLoaded] = useState<boolean>(false);

	const [openAddUserToTeam, setOpenAddUserToTeam] = useState<boolean>(false);

	const [openAddStaffToTeam, setOpenAddStaffToTeam] = useState<boolean>(false);

	const [openRemoveUser, setOpenRemoveUser] = useState<boolean>(false);
	const [removeUserMessage, setRemoveUserMessage] = useState<string>('');
	const [userSelectedToRemove, setUserSelectedToRemove] = useState<IUser | undefined>(undefined);

	const { enqueueSnackbar } = useSnackbar();

	const hasTeam = (teams: string[]) => {
		return teams.findIndex((teamName) => teamName === team.id) > -1;
	};

	const handleOpenRoster = (team: ITeam) => (_: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded);

		if (isExpanded && !hasLoaded) {
			setLoadingManagers([...team.managers]);
			setLoadingStaff([...team.staff]);
			const managerIds = [...team.managers];
			const staffIds = [...team.staff];

			const managerGet = api.postGetData(`users`, {
				userIds: managerIds,
			});

			const staffGet = api.postGetData(`staff/list`, {
				staffIds,
			});

			Promise.all([managerGet, staffGet])
				.then((results) => {
					console.log(results);
					const managers = results[0].users;
					const staff = results[1].staff;
					setManagers(managers);
					setStaff(staff);
					setHasLoaded(true);
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => {
					setLoadingManagers([]);
					setLoadingStaff([]);
				});
		}
	};

	const handleDeleteTeam = () => {
		onOpenDeleteTeam(team.id);
	};

	const handleOpenAddUserToTeam = () => {
		setTeamMembersToAdd([]);
		api.getAllData<IUser>(`users`)
			.then((retreivedUsers) => {
				const users = retreivedUsers;

				const availableUsers = users.filter((user) => {
					return !user.teams || !hasTeam(user.teams);
				});

				setTeamMembersToAdd(availableUsers);
			})
			.catch((err) => {
				console.error(err);
			});

		setOpenAddUserToTeam(true);
	};

	const handleOpenAddStaffToTeam = () => {
		setTeamMembersToAdd([]);
		api.getAllData<IUser>(`staff`)
			.then((retreivedUsers) => {
				const staff = retreivedUsers;

				const availableStaff = staff.filter((s) => {
					return !s.teams || !hasTeam(s.teams);
				});

				setTeamMembersToAdd(availableStaff);
			})
			.catch((err) => {
				console.error(err);
			});

		setOpenAddStaffToTeam(true);
	};

	const handleOpenRemoveUser = (user: IUser) => {
		setUserSelectedToRemove(user);
		setRemoveUserMessage(
			`Are you sure you want to Remove ${user.firstName!} ${user.lastName} from ${team.id}`
		);
		setOpenRemoveUser(true);
	};

	const handleRemoveUserFromTeam = () => {
		setIsLoading(true);
		if (userSelectedToRemove) {
			if ('email' in userSelectedToRemove) {
				api.post(`teams/${team.id}/remove-user`, {
					user: userSelectedToRemove,
				})
					.then(() => {
						enqueueSnackbar(`User removed from ${team.id}`, { variant: 'success' });

						const newManagers = managers.filter(
							(manager) => manager.email !== userSelectedToRemove.email
						);
						setManagers(newManagers);
					})
					.catch((err) => {
						enqueueSnackbar('An error occured, please try again!', {
							variant: 'error',
						});
						console.error(err);
					})
					.finally(() => {
						setIsLoading(false);
						handleCloseRemoveUser();
					});
			} else {
				api.post(`teams/${team.id}/remove-staff`, {
					staff: userSelectedToRemove,
				})
					.then(() => {
						enqueueSnackbar(`User removed from ${team.id}`, { variant: 'success' });
						const newStaff = staff.filter(
							(staff) => staff.id !== (userSelectedToRemove as IUser).id
						);

						setStaff(newStaff);
					})
					.catch((err) => {
						enqueueSnackbar('An error occured, please try again!', {
							variant: 'error',
						});
						console.error(err);
					})
					.finally(() => {
						setIsLoading(false);
						handleCloseRemoveUser();
					});
			}
		}
	};

	const handleCloseAddUserToTeam = () => {
		setOpenAddUserToTeam(false);
	};

	const handleCloseAddStaffToTeam = () => {
		setOpenAddStaffToTeam(false);
	};

	const handleCloseRemoveUser = () => {
		setOpenRemoveUser(false);
	};

	const handleAddTeamMemberComplete = (data: any, isStaff: boolean) => {
		if (isStaff) {
			handleAddStaffCompleted(data as IUser);
		} else {
			handleAddUserCompleted(data as IUser);
		}
	};

	const handleAddUserCompleted = (userAdded: IUser) => {
		setManagers((prev) => [...prev, userAdded]);
		setOpenAddUserToTeam(false);
	};

	const handleAddStaffCompleted = (userAdded: IUser) => {
		setStaff((prev) => [...prev, userAdded]);
		setOpenAddStaffToTeam(false);
	};

	return (
		<Box sx={{ my: 1 }}>
			<Accordion expanded={expanded} onChange={handleOpenRoster(team)}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant="h3">{team.id}</Typography>
					<Box
						sx={{
							width: '50px',
							ml: 2,
							borderRadius: '10%',
						}}
					></Box>
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={{ mb: 2 }}>
						<Typography variant="h4">Managers</Typography>
						<List sx={{ width: '100%' }}>
							{loadingManagers.length > 0 ? (
								<SkeletonTeamList loadingStaff={loadingManagers} />
							) : (
								<TeamList members={managers} onRemoveUser={handleOpenRemoveUser} />
							)}
						</List>
					</Box>

					<Box>
						<Typography variant="h4">Staff</Typography>
						<List sx={{ width: '100%' }}>
							{loadingStaff.length > 0 ? (
								<SkeletonTeamList loadingStaff={loadingStaff} />
							) : (
								<TeamList members={staff} onRemoveUser={handleOpenRemoveUser} />
							)}
						</List>
					</Box>
				</AccordionDetails>
				<PermissionCheck permissionLevel={2}>
					<AccordionActions>
						<Tooltip title="Add Manager">
							<IconButton size="large" onClick={handleOpenAddUserToTeam}>
								<PersonAddIcon color="primary" fontSize="large" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Add Staff">
							<IconButton size="large" onClick={handleOpenAddStaffToTeam}>
								<GroupAddIcon color="primary" fontSize="large" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Delete Team">
							<IconButton size="large" onClick={handleDeleteTeam}>
								<DeleteIcon color="primary" fontSize="large" />
							</IconButton>
						</Tooltip>
					</AccordionActions>
				</PermissionCheck>
			</Accordion>
			<AddUserToTeamDialog
				open={openAddUserToTeam}
				teamName={team.id}
				membersToAdd={teamMembersToAdd}
				onDialogClose={handleCloseAddUserToTeam}
				onAddComplete={handleAddTeamMemberComplete}
				isStaff={false}
			/>
			<AddUserToTeamDialog
				open={openAddStaffToTeam}
				teamName={team.id}
				membersToAdd={teamMembersToAdd}
				onDialogClose={handleCloseAddStaffToTeam}
				onAddComplete={handleAddTeamMemberComplete}
				isStaff={true}
			/>
			<DeleteConfirmation
				open={openRemoveUser}
				message={removeUserMessage}
				isLoading={isLoading}
				onClose={handleCloseRemoveUser}
				onConfirm={handleRemoveUserFromTeam}
			/>
		</Box>
	);
};

export default TeamRoster;
