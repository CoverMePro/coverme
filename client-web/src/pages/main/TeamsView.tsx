import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import {
  Box,
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

const TeamsView: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
  const [teams, setTeams] = useState<ITeamInfo[]>([]);
  const [selectedTeamManagers, setSelectedTeamManagers] = useState<IUserInfo[]>(
    []
  );
  const [selectedTeamStaff, setSelectedTeamStaff] = useState<IUserInfo[]>([]);

  const user = useTypedSelector((state) => state.user);

  const handleOpenAddTeam = () => {
    setOpenAddTeam(true);
  };

  const handleCloseAddTeam = () => {
    setOpenAddTeam(false);
  };

  const handleTeamChange =
    (team: ITeamInfo) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? team.name : false);
      const emails = [...team.managers, ...team.staff];
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
        });
    };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/company/${user.company!}/team`)
      .then((result) => {
        console.log(result.data);
        setTeams(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="h1">Teams</Typography>
        <Tooltip title="Create Team">
          <IconButton size="large" onClick={handleOpenAddTeam}>
            <AddCircleIcon color="primary" fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
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
              </List>
            </Box>

            <Box>
              <Typography variant="h4">Staff</Typography>
              <List sx={{ width: '100%' }}>
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
              </List>
            </Box>
          </AccordionDetails>
          <AccordionActions>
            <Tooltip title="Add To Team">
              <IconButton size="large">
                <PersonAddIcon color="primary" fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Team">
              <IconButton size="large">
                <DeleteIcon color="primary" fontSize="large" />
              </IconButton>
            </Tooltip>
          </AccordionActions>
        </Accordion>
      ))}

      <Dialog open={openAddTeam} onClose={handleCloseAddTeam}>
        <CreateTeamForm onFinish={handleCloseAddTeam} />
      </Dialog>
    </Box>
  );
};

export default TeamsView;
