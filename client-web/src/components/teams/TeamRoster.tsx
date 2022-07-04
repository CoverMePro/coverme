import React, { useState } from 'react';

import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

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

import { ITeamInfo } from 'models/Team';
import { IUser } from 'models/User';

import SkeletonTeamList from './SkeletonTeamList';
import TeamList from './TeamList';
import PermissionCheck from 'components/auth/PermissionCheck';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import AddUserToTeamDialog from 'components/dialogs/AddUserToTeamDialog';

import axios from 'utils/axios-intance';

interface ITeamRosterProps {
    team: ITeamInfo;
    onOpenDeleteTeam: (teamName: string) => void;
}

const TeamRoster: React.FC<ITeamRosterProps> = ({ team, onOpenDeleteTeam }) => {
    const [loadingManagers, setLoadingManagers] = useState<string[]>([]);
    const [loadingStaff, setLoadingStaff] = useState<string[]>([]);
    const [managers, setManagers] = useState<IUser[]>([]);
    const [staff, setStaff] = useState<IUser[]>([]);
    const [usersToAdd, setUsersToAdd] = useState<IUser[]>([]);

    const [expanded, setExpanded] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    const [openAddUserToTeam, setOpenAddUserToTeam] = useState<boolean>(false);

    const [openRemoveUser, setOpenRemoveUser] = useState<boolean>(false);
    const [removeUserMessage, setRemoveUserMessage] = useState<string>('');
    const [userSelectedToRemove, setUserSelectedToRemove] = useState<IUser | undefined>(undefined);

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const hasTeam = (teams: string[]) => {
        return teams.findIndex((teamName) => teamName === team.name) > -1;
    };

    const handleOpenRoster =
        (team: ITeamInfo) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded);

            if (isExpanded && !hasLoaded) {
                setLoadingManagers([...team.managers]);
                setLoadingStaff([...team.staff]);
                const emails = [...team.managers, ...team.staff];
                if (emails.length > 0) {
                    axios
                        .post(`${process.env.REACT_APP_SERVER_API}/user`, {
                            emails,
                        })
                        .then((result) => {
                            const { managers, staff } = result.data;
                            setManagers(managers);
                            setStaff(staff);
                            setHasLoaded(true);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                            setLoadingManagers([]);
                            setLoadingStaff([]);
                        });
                }
            }
        };

    const handleDeleteTeam = () => {
        onOpenDeleteTeam(team.name);
    };

    const handleOpenAddUserToTeam = () => {
        setUsersToAdd([]);
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
            `Are you sure you want to Remove ${user.firstName!} ${user.lastName} from ${team.name}`
        );
        setOpenRemoveUser(true);
    };

    const handleRemoveUserFromTeam = () => {
        setIsLoading(true);
        if (userSelectedToRemove) {
            axios
                .post(
                    `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/team/${
                        team.name
                    }/remove-user`,
                    {
                        user: userSelectedToRemove,
                    }
                )
                .then(() => {
                    enqueueSnackbar(`User removed from ${team.name}`, { variant: 'success' });
                    if (userSelectedToRemove.role === 'manager') {
                        const newManagers = managers.filter(
                            (manager) => manager.email !== userSelectedToRemove.email
                        );
                        setManagers(newManagers);
                    } else if (userSelectedToRemove.role === 'staff') {
                        const newStaff = staff.filter(
                            (staff) => staff.email !== userSelectedToRemove.email
                        );
                        setStaff(newStaff);
                    }
                })
                .catch((err) => {
                    enqueueSnackbar('An error occured, please try again!', {
                        variant: 'error',
                    });
                    console.log(err);
                })
                .finally(() => {
                    setIsLoading(false);
                    handleCloseRemoveUser();
                });
        }
    };

    const handleCloseAddUserToTeam = () => {
        setOpenAddUserToTeam(false);
    };

    const handleCloseRemoveUser = () => {
        setOpenRemoveUser(false);
    };

    const handleAddUserCompleted = (userAdded: IUser) => {
        if (userAdded.role === 'manager') {
            setManagers((prev) => [...prev, userAdded]);
        } else if (userAdded.role === 'staff') {
            setStaff((prev) => [...prev, userAdded]);
        }

        setOpenAddUserToTeam(false);
    };

    return (
        <Box sx={{ my: 1 }}>
            <Accordion expanded={expanded} onChange={handleOpenRoster(team)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h3">{team.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4">Managers</Typography>
                        <List sx={{ width: '100%' }}>
                            {loadingManagers.length > 0 ? (
                                <SkeletonTeamList loadingStaff={loadingManagers} />
                            ) : (
                                <TeamList staff={managers} onRemoveUser={handleOpenRemoveUser} />
                            )}
                        </List>
                    </Box>

                    <Box>
                        <Typography variant="h4">Staff</Typography>
                        <List sx={{ width: '100%' }}>
                            {loadingStaff.length > 0 ? (
                                <SkeletonTeamList loadingStaff={loadingStaff} />
                            ) : (
                                <TeamList staff={staff} onRemoveUser={handleOpenRemoveUser} />
                            )}
                        </List>
                    </Box>
                </AccordionDetails>
                <PermissionCheck permissionLevel={2}>
                    <AccordionActions>
                        <Tooltip title="Add To Team">
                            <IconButton size="large" onClick={handleOpenAddUserToTeam}>
                                <PersonAddIcon color="primary" fontSize="large" />
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
                teamName={team.name}
                usersToAdd={usersToAdd}
                onDialogClose={handleCloseAddUserToTeam}
                onAddComplete={handleAddUserCompleted}
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
