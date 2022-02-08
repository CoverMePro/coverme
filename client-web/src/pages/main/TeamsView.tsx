import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import {
    Box,
    Autocomplete,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
    List,
    Typography,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { ITeamInfo } from 'models/Team';
import { IUser } from 'models/User';

import CreateTeamForm from 'components/forms/CreateTeamForm';
import DeleteConfirmation from 'components/confirmation/DeleteConfirmation';

import axios from 'utils/axios-intance';
import SkeletonTeamList from 'components/teams/SkeletonTeamList';
import TeamList from 'components/teams/TeamList';

const TeamsView: React.FC = () => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);
    const [isLoadingDataUpdate, setIsLoadingDataUpdate] = useState<boolean>(false);
    const [loadingRosterManager, setLoadingRosterManger] = useState<string[]>([]);
    const [loadingRosterStaff, setLoadingRosterStaff] = useState<string[]>([]);
    const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
    const [openAddUserToTeam, setOpenAddUserToTeam] = useState<boolean>(false);
    const [openDeleteTeam, setOpenDeleteTeam] = useState<boolean>(false);
    const [openRemoveUser, setOpenRemoveUser] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [removeUserMessage, setRemoveUserMessage] = useState<string>('');
    const [teams, setTeams] = useState<ITeamInfo[]>([]);
    const [usersToAdd, setUsersToAdd] = useState<IUser[]>([]);
    const [userSelectedToAdd, setUserSelectedToAdd] = useState<IUser | undefined>(undefined);
    const [userSelectedToRemove, setUserSelectedToRemove] = useState<IUser | undefined>(undefined);
    const [cachedSelected, setCachedSelected] = useState<string>('');
    const [selectedTeamManagers, setSelectedTeamManagers] = useState<IUser[]>([]);
    const [selectedTeamStaff, setSelectedTeamStaff] = useState<IUser[]>([]);

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleOpenAddTeam = () => {
        setOpenAddTeam(true);
    };

    const hasTeam = (teams: string[]) => {
        return teams.findIndex((team) => team === (expanded as string)) > -1;
    };

    const handleOpenAddUserToTeam = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
            .then((result) => {
                const users: IUser[] = result.data.users;

                const availableUsers = users.filter((user) => {
                    return !user.teams || !hasTeam(user.teams);
                });

                setUsersToAdd(availableUsers);
            })
            .catch((err) => {
                console.log(err);
            });

        setOpenAddUserToTeam(true);
    };

    const handleOpenRemoveUser = (user: IUser) => {
        setUserSelectedToRemove(user);
        setRemoveUserMessage(
            `Are you sure you want to Remove ${user.firstName!} ${user.lastName} from ${
                expanded ? expanded : 'this team'
            }`
        );
        setOpenRemoveUser(true);
    };

    const handleOpenDeleteTeam = () => {
        setDeleteMessage(`Are you sure you want to delete ${expanded ? expanded : 'this team'}?`);
        setOpenDeleteTeam(true);
    };

    const handleCloseAddTeam = () => {
        setOpenAddTeam(false);
    };

    const handleCloseAddUserToTeam = () => {
        setOpenAddUserToTeam(false);
    };

    const handleCloseRemoveUser = () => {
        setOpenRemoveUser(false);
    };

    const handleOnTeamAdd = () => {
        handleCloseAddTeam();
        handleGetTeams();
    };

    const handleTeamChange =
        (team: ITeamInfo) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? team.name : false);

            if (team.name !== cachedSelected) {
                setSelectedTeamManagers([]);
                setSelectedTeamStaff([]);

                setLoadingRosterManger([...team.managers]);
                setLoadingRosterStaff([...team.staff]);

                const emails = [...team.managers, ...team.staff];
                if (emails.length > 0) {
                    axios
                        .post(`${process.env.REACT_APP_SERVER_API}/user`, {
                            emails,
                        })
                        .then((result) => {
                            const { managers, staff } = result.data;
                            setSelectedTeamManagers(managers);
                            setSelectedTeamStaff(staff);
                            setCachedSelected(team.name);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            setLoadingRosterManger([]);
                            setLoadingRosterStaff([]);
                        });
                }
            }
        };

    const handleConfirmDeleteTeam = () => {
        setIsLoadingDataUpdate(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/team/${expanded}/delete`
            )
            .then(() => {
                enqueueSnackbar(`${expanded} successfully deleted.`, {
                    variant: 'success',
                });
                handleGetTeams();
                setExpanded(false);
            })
            .catch((err) => {
                console.log(err);
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

    const handleSelectUserToAdd = (selectUser: IUser | null) => {
        if (selectUser) {
            setUserSelectedToAdd(selectUser);
        } else {
            setUserSelectedToAdd(undefined);
        }
    };

    const handleAddUserToTeam = () => {
        setIsLoadingDataUpdate(true);
        if (expanded !== false && userSelectedToAdd) {
            axios
                .post(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/team/${expanded}/add-user`,
                    {
                        user: userSelectedToAdd,
                    }
                )
                .then(() => {
                    enqueueSnackbar(`User added to ${expanded}`, { variant: 'success' });
                    if (userSelectedToAdd.role === 'manager') {
                        setSelectedTeamManagers((prev) => [...prev, userSelectedToAdd]);
                    } else if (userSelectedToAdd.role === 'staff') {
                        setSelectedTeamStaff((prev) => [...prev, userSelectedToAdd]);
                    }
                })
                .catch((err) => {
                    enqueueSnackbar('An error occured, please try again!', {
                        variant: 'error',
                    });
                    console.log(err);
                })
                .finally(() => {
                    setIsLoadingDataUpdate(false);
                    handleCloseAddUserToTeam();
                });
        }
    };

    const handleRemoveUserFromTeam = () => {
        setIsLoadingDataUpdate(true);
        if (expanded !== false && userSelectedToRemove) {
            axios
                .post(
                    `${
                        process.env.REACT_APP_SERVER_API
                    }/company/${user.company!}/team/${expanded}/remove-user`,
                    {
                        user: userSelectedToRemove,
                    }
                )
                .then(() => {
                    enqueueSnackbar(`User removed from ${expanded}`, { variant: 'success' });
                    if (userSelectedToRemove.role === 'manager') {
                        const newSelectedTeamManagers = selectedTeamManagers.filter(
                            (manager) => manager.email !== userSelectedToRemove.email
                        );
                        setSelectedTeamManagers(newSelectedTeamManagers);
                    } else if (userSelectedToRemove.role === 'staff') {
                        const newSelectedTeamStaff = selectedTeamStaff.filter(
                            (staff) => staff.email !== userSelectedToRemove.email
                        );
                        setSelectedTeamStaff(newSelectedTeamStaff);
                    }
                })
                .catch((err) => {
                    enqueueSnackbar('An error occured, please try again!', {
                        variant: 'error',
                    });
                    console.log(err);
                })
                .finally(() => {
                    setIsLoadingDataUpdate(false);
                    handleCloseRemoveUser();
                });
        }
    };

    const handleGetTeams = useCallback(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/${user.company!}/team`)
            .then((result) => {
                console.log(result.data);
                setTeams(result.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoadingTeams(false);
            });
    }, [user.company]);

    useEffect(() => {
        setIsLoadingTeams(true);
        handleGetTeams();
    }, [handleGetTeams]);

    return (
        <Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Teams</Typography>
                <Tooltip title="Create Team">
                    <IconButton size="large" onClick={handleOpenAddTeam}>
                        <AddCircleIcon color="primary" fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Box>
            {isLoadingTeams ? (
                <Box
                    sx={{
                        width: '80%',
                        mt: 3,
                        mx: 'auto',
                    }}
                >
                    <LinearProgress color="primary" />
                </Box>
            ) : (
                <>
                    {teams.map((team) => (
                        <Accordion
                            key={team.name}
                            expanded={expanded === team.name}
                            onChange={handleTeamChange(team)}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h3">{team.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h4">Managers</Typography>
                                    <List sx={{ width: '100%' }}>
                                        {loadingRosterManager.length > 0 ? (
                                            <SkeletonTeamList loadingStaff={loadingRosterManager} />
                                        ) : (
                                            <TeamList
                                                staff={selectedTeamManagers}
                                                onRemoveUser={handleOpenRemoveUser}
                                            />
                                        )}
                                    </List>
                                </Box>

                                <Box>
                                    <Typography variant="h4">Staff</Typography>
                                    <List sx={{ width: '100%' }}>
                                        {loadingRosterStaff.length > 0 ? (
                                            <SkeletonTeamList loadingStaff={loadingRosterStaff} />
                                        ) : (
                                            <TeamList
                                                staff={selectedTeamStaff}
                                                onRemoveUser={handleOpenRemoveUser}
                                            />
                                        )}
                                    </List>
                                </Box>
                            </AccordionDetails>
                            <AccordionActions>
                                <Tooltip title="Add To Team">
                                    <IconButton size="large" onClick={handleOpenAddUserToTeam}>
                                        <PersonAddIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Team">
                                    <IconButton size="large" onClick={handleOpenDeleteTeam}>
                                        <DeleteIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </AccordionActions>
                        </Accordion>
                    ))}
                </>
            )}

            <Dialog open={openAddTeam} onClose={handleCloseAddTeam}>
                <CreateTeamForm onFinish={handleOnTeamAdd} />
            </Dialog>
            <Dialog open={openAddUserToTeam} onClose={handleCloseAddUserToTeam}>
                <DialogTitle>Add User to {expanded}</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        sx={{ mt: 2 }}
                        disablePortal
                        options={usersToAdd}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                        onChange={(e, val) => {
                            handleSelectUserToAdd(val);
                        }}
                        renderInput={(params: any) => (
                            <TextField {...params} variant="outlined" label="User" />
                        )}
                    />
                    <DialogActions sx={{ mt: 2 }}>
                        {isLoadingDataUpdate ? (
                            <CircularProgress sx={{ mb: 1, mr: 1 }} size={25} />
                        ) : (
                            <>
                                <Button onClick={handleCloseAddUserToTeam}>Cancel</Button>
                                <Button onClick={handleAddUserToTeam}>Add</Button>
                            </>
                        )}
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <DeleteConfirmation
                open={openDeleteTeam}
                message={deleteMessage}
                isLoading={isLoadingDataUpdate}
                onClose={handleCloseDeleteTeam}
                onConfirm={handleConfirmDeleteTeam}
            />
            <DeleteConfirmation
                open={openRemoveUser}
                message={removeUserMessage}
                isLoading={isLoadingDataUpdate}
                onClose={handleCloseRemoveUser}
                onConfirm={handleRemoveUserFromTeam}
            />
        </Box>
    );
};

export default TeamsView;
