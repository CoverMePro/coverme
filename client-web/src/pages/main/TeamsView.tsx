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
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Skeleton,
  TextField,
  Button,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import CreateTeamForm from 'components/forms/CreateTeamForm';

import axios from 'utils/axios-intance';
import { ITeamInfo } from 'models/Team';
import { IUserInfo } from 'models/User';
import DeleteConfirmation from 'components/confirmation/DeleteConfirmation';

const TeamsView: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);
  const [isLoadingDeleteTeam, setIsLoadingDeleteTeam] =
    useState<boolean>(false);
  const [loadingRosterManager, setLoadingRosterManger] = useState<string[]>([]);
  const [loadingRosterStaff, setLoadingRosterStaff] = useState<string[]>([]);
  const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
  const [openAddUserToTeam, setOpenAddUserToTeam] = useState<boolean>(false);
  const [openDeleteTeam, setOpenDeleteTeam] = useState<boolean>(false);
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [teams, setTeams] = useState<ITeamInfo[]>([]);
  const [usersToAdd, setUsersToAdd] = useState<IUserInfo[]>([]);
  const [userSelectedToAdd, setUserSelectedToAdd] = useState<
    IUserInfo | undefined
  >(undefined);
  const [selectedTeamManagers, setSelectedTeamManagers] = useState<IUserInfo[]>(
    []
  );
  const [selectedTeamStaff, setSelectedTeamStaff] = useState<IUserInfo[]>([]);

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
        const users: IUserInfo[] = result.data.users;

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

  const handleOpenDeleteTeam = () => {
    setDeleteMessage(
      `Are you sure you want to delete ${expanded ? expanded : 'this team'}?`
    );
    setOpenDeleteTeam(true);
  };

  const handleCloseAddTeam = () => {
    setOpenAddTeam(false);
  };

  const handleClostAddUserToTeam = () => {
    setOpenAddUserToTeam(false);
  };

  const handleOnTeamAdd = () => {
    handleCloseAddTeam();
    handleGetTeams();
  };

  const handleTeamChange =
    (team: ITeamInfo) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? team.name : false);
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
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoadingRosterManger([]);
            setLoadingRosterStaff([]);
          });
      }
    };

  const handleConfirmDeleteTeam = () => {
    setIsLoadingDeleteTeam(true);
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
        setIsLoadingDeleteTeam(false);
        handleCloseDeleteTeam();
      });
  };

  const handleCloseDeleteTeam = () => {
    setOpenDeleteTeam(false);
  };

  const handleSelectUserToAdd = (selectUser: IUserInfo | null) => {
    if (selectUser) {
      setUserSelectedToAdd(selectUser);
    } else {
      setUserSelectedToAdd(undefined);
    }
  };

  const handleAddUserToTeam = () => {
    if (expanded !== false && userSelectedToAdd) {
      axios
        .post(
          `${
            process.env.REACT_APP_SERVER_API
          }/${userSelectedToAdd.email!}/add-team`,
          {
            team: expanded,
          }
        )
        .then(() => {
          enqueueSnackbar(`User added to ${expanded}`, { variant: 'success' });
          if (userSelectedToAdd.role === 'manager') {
            setSelectedTeamManagers((prev) => [...prev, userSelectedToAdd]);
          } else if (userSelectedToAdd.role === 'staff') {
            setSelectedTeamStaff((prev) => [...prev, userSelectedToAdd]);
          }
          handleClostAddUserToTeam();
        })
        .catch((err) => {
          enqueueSnackbar('An error occured, please try again!', {
            variant: 'error',
          });
          console.log(err);
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
  }, []);

  return (
    <Box>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      >
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
                      <>
                        {loadingRosterManager.map((loadManager) => (
                          <Box
                            key={loadManager}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box
                              sx={{
                                ml: 2,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                              />
                              <Box sx={{ ml: 2 }}>
                                <Skeleton
                                  variant="text"
                                  width={75}
                                  height={10}
                                />
                                <Skeleton
                                  variant="text"
                                  width={50}
                                  height={10}
                                />
                              </Box>
                            </Box>

                            <Box sx={{ ml: 2 }}>
                              <Skeleton variant="text" width={75} height={10} />
                              <Skeleton variant="text" width={75} height={10} />
                            </Box>
                            <Skeleton
                              sx={{ mr: 2 }}
                              variant="circular"
                              width={20}
                              height={20}
                            />
                          </Box>
                        ))}
                      </>
                    ) : (
                      <>
                        {selectedTeamManagers.map((manager) => (
                          <ListItem
                            key={manager.email!}
                            sx={{ width: '100%' }}
                            secondaryAction={
                              <IconButton edge="end" aria-label="delete">
                                <RemoveCircleIcon color="primary" />
                              </IconButton>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <AccountCircleIcon color="secondary" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${manager.firstName} ${manager.lastName}`}
                              secondary={manager.position}
                            />
                            <ListItemText
                              primary={manager.email}
                              secondary={manager.phoneNo}
                            />
                          </ListItem>
                        ))}
                      </>
                    )}
                  </List>
                </Box>

                <Box>
                  <Typography variant="h4">Staff</Typography>
                  <List sx={{ width: '100%' }}>
                    {loadingRosterStaff.length > 0 ? (
                      <>
                        {loadingRosterManager.map((loadStaff) => (
                          <Box
                            key={loadStaff}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box
                              sx={{
                                ml: 2,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                              />
                              <Box sx={{ ml: 2 }}>
                                <Skeleton
                                  variant="text"
                                  width={75}
                                  height={10}
                                />
                                <Skeleton
                                  variant="text"
                                  width={50}
                                  height={10}
                                />
                              </Box>
                            </Box>

                            <Box sx={{ ml: 2 }}>
                              <Skeleton variant="text" width={75} height={10} />
                              <Skeleton variant="text" width={75} height={10} />
                            </Box>
                            <Skeleton
                              sx={{ mr: 2 }}
                              variant="circular"
                              width={20}
                              height={20}
                            />
                          </Box>
                        ))}
                      </>
                    ) : (
                      <>
                        {selectedTeamStaff.map((staff) => (
                          <ListItem
                            key={staff.email!}
                            sx={{ width: '100%' }}
                            secondaryAction={
                              <IconButton edge="end" aria-label="delete">
                                <RemoveCircleIcon color="primary" />
                              </IconButton>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <AccountCircleIcon color="secondary" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${staff.firstName} ${staff.lastName}`}
                              secondary={staff.position}
                            />
                            <ListItemText
                              primary={staff.email}
                              secondary={staff.phoneNo}
                            />
                          </ListItem>
                        ))}
                      </>
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
      <Dialog open={openAddUserToTeam} onClose={handleClostAddUserToTeam}>
        <DialogTitle>Add User to {expanded}</DialogTitle>
        <DialogContent>
          <Autocomplete
            sx={{ mt: 2 }}
            disablePortal
            options={usersToAdd}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            onChange={(e, val) => {
              handleSelectUserToAdd(val);
            }}
            renderInput={(params: any) => (
              <TextField {...params} variant="outlined" label="User" />
            )}
          />
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={handleClostAddUserToTeam}>Cancel</Button>
            <Button onClick={handleAddUserToTeam}>Add</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <DeleteConfirmation
        open={openDeleteTeam}
        message={deleteMessage}
        isLoading={isLoadingDeleteTeam}
        onClose={handleCloseDeleteTeam}
        onConfirm={handleConfirmDeleteTeam}
      />
    </Box>
  );
};

export default TeamsView;
