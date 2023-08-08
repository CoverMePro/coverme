import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import {
	Box,
	Typography,
	SelectChangeEvent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import PageLoading from 'components/loading/PageLoading';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import CreateStaffForm from 'components/forms/CreateStaffForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import { getAddAction, getEditDeleteAction } from 'utils/react/table-actions-helper';
import { formatDateString } from 'utils/formatters/dateTime-formatter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from 'utils/api';

import { IStaff, StaffHeadCells, ITeam, ILastCallouts } from 'coverme-shared';

const StaffView: React.FC = () => {
	const [openAddStaff, setOpenAddStaff] = useState<boolean>(false);
	const [openDeleteStaff, setOpenDeleteStaff] = useState<boolean>(false);
	const [openEditStaff, setOpenEditStaff] = useState<boolean>(false);
	const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
	const [isLoadingDeleteStaff, setIsLoadingDeleteStaff] = useState<boolean>(false);
	const [deleteMessage, setDeleteMessage] = useState<string>('');
	const [selected, setSelected] = useState<any | undefined>(undefined);
	const [selectedTeam, setSelectedTeam] = useState<string>('all');
	const [staff, setStaff] = useState<IStaff[]>([]);
	const [teams, setTeams] = useState<string[]>([]);
	const [lastCallouts, setLastCallouts] = useState<ILastCallouts | undefined>(undefined);
	const [filteredStaff, setFilteredStaff] = useState<IStaff[]>([]);

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
		api.get(`staff/delete/${selected}`)
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

	const setTeamsSelect = (incomingTeams: ITeam[]) => {
		const teamNames = incomingTeams.map((team) => {
			return team.id;
		});

		setTeams([...teamNames]);
	};

	const formatLastCalloutStaff = useCallback(
		(staff: IStaff[], lastCallouts: ILastCallouts | undefined, teams: string) => {
			const newStaff = clearCheck([...staff]);
			if (teams === 'all') {
				if (!lastCallouts || !lastCallouts.external || !lastCallouts.external.id) {
					return newStaff;
				}

				const lastExternalCallout = lastCallouts.external.id;

				newStaff.forEach((staff) => {
					if (staff.id! === lastExternalCallout) {
						staff.lastCalledOut = <CheckCircleIcon color="primary" fontSize="medium" />;
					}
				});

				return newStaff;
			}

			const teamFilteredStaff = newStaff.filter((staff) => staffContainsTeam(staff, teams));

			if (!lastCallouts || !lastCallouts.internal || !lastCallouts.internal[teams]) {
				return teamFilteredStaff;
			}

			const lastInternalCallout = lastCallouts.internal[teams];

			teamFilteredStaff.forEach((staff) => {
				if (staff.id! === lastInternalCallout)
					staff.lastCalledOut = <CheckCircleIcon color="primary" fontSize="medium" />;
			});

			return teamFilteredStaff;
		},
		[]
	);

	const handleGetUsers = useCallback(() => {
		api.getAllData<IStaff>(`staff`)
			.then((staff) => {
				api.getGenericData(`overtime-callouts/staffList`)
					.then((result) => {
						const fetchedLastCallouts = result.lastCallouts;
						const formattedDateStaff = formatHireDate(staff);
						const formattedFetchedStaff = formatLastCalloutStaff(
							formattedDateStaff,
							fetchedLastCallouts,
							'all'
						);

						setStaff(formattedFetchedStaff);
						setFilteredStaff(formattedFetchedStaff);
						setLastCallouts(fetchedLastCallouts);
					})
					.catch((err) => {
						console.error(err);
					})
					.finally(() => setIsLoadingStaff(false));
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => setIsLoadingStaff(false));

		api.getAllData<ITeam>(`teams`)
			.then((teams) => {
				setTeamsSelect(teams);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [formatLastCalloutStaff]);

	const clearCheck = (staff: IStaff[]) => {
		return staff.map((staff) => {
			staff.lastCalledOut = undefined;
			return staff;
		});
	};

	const staffContainsTeam = (staff: IStaff, team: string) => {
		if (!staff.teams || staff.teams.length === 0) {
			return false;
		}
		return staff.teams.findIndex((t: string) => t === team) !== -1;
	};

	const handleTeamChange = (event: SelectChangeEvent) => {
		const team = event.target.value as string;
		const newStaffList = formatLastCalloutStaff([...staff], lastCallouts, team);
		setFilteredStaff([...newStaffList]);
		setSelectedTeam(team);
	};

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
			<FormControl>
				<InputLabel id="team-lable">Teams</InputLabel>
				<Select
					labelId="team-lable"
					value={selectedTeam}
					label="Teams"
					onChange={handleTeamChange}
				>
					<MenuItem value={'all'}>All Teams</MenuItem>
					{teams.map((team) => {
						return (
							<MenuItem key={team} value={team}>
								{team}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			{isLoadingStaff ? (
				<PageLoading />
			) : (
				<Box>
					<EnhancedTable
						data={filteredStaff}
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
