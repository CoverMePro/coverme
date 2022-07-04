import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Typography, Tooltip, IconButton } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import { ITeamInfo } from 'models/Team';

import CreateTeamForm from 'components/forms/CreateTeamForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import PermissionCheck from 'components/auth/PermissionCheck';
import LinearLoading from 'components/loading/LineraLoading';
import TeamRoster from 'components/teams/TeamRoster';

import axios from 'utils/axios-intance';

const TeamsView: React.FC = () => {
    const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);
    const [isLoadingDataUpdate, setIsLoadingDataUpdate] = useState<boolean>(false);
    const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
    const [openDeleteTeam, setOpenDeleteTeam] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [teams, setTeams] = useState<ITeamInfo[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');

    const user = useTypedSelector((state) => state.user);

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

    const handleOnTeamAdd = () => {
        handleCloseAddTeam();
        handleGetTeams();
    };

    const handleConfirmDeleteTeam = () => {
        setIsLoadingDataUpdate(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/team/${selectedTeam}/delete`
            )
            .then(() => {
                enqueueSnackbar(`${selectedTeam} successfully deleted.`, {
                    variant: 'success',
                });
                handleGetTeams();
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
                    <LinearLoading />
                </>
            ) : (
                <>
                    {teams.map((team) => (
                        <TeamRoster
                            key={team.name}
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
        </Box>
    );
};

export default TeamsView;
