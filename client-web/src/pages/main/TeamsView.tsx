import React, { useState } from 'react';

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
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const TeamsView: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleTeamChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      >
        <Typography variant="h1">Teams</Typography>
        <Tooltip title="Create Team">
          <IconButton size="large">
            <AddCircleIcon color="primary" fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Accordion
        expanded={expanded === 'Team 1'}
        onChange={handleTeamChange('Team 1')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h3">Team 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">Managers</Typography>
            <List sx={{ width: '100%' }}>
              <ListItem
                sx={{ width: '100%' }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <RemoveCircleIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Jim Layhey" secondary="Manager" />
                <ListItemText
                  primary="Jlayhey@test.com"
                  secondary="226-234-1232"
                />
              </ListItem>
            </List>
          </Box>

          <Box>
            <Typography variant="h4">Staff</Typography>
            <List sx={{ width: '100%' }}>
              <ListItem
                sx={{ width: '100%' }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <RemoveCircleIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Randy Layhey" secondary="Tester" />
                <ListItemText
                  primary="rayhey@test.com"
                  secondary="226-234-1232"
                />
              </ListItem>
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
      <Accordion
        expanded={expanded === 'Team 2'}
        onChange={handleTeamChange('Team 2')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h3">Team 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">Managers</Typography>
            <List sx={{ width: '100%' }}>
              <ListItem
                sx={{ width: '100%' }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <RemoveCircleIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Jim Layhey" secondary="Manager" />
                <ListItemText
                  primary="Jlayhey@test.com"
                  secondary="226-234-1232"
                />
              </ListItem>
            </List>
          </Box>

          <Box>
            <Typography variant="h4">Staff</Typography>
            <List sx={{ width: '100%' }}>
              <ListItem
                sx={{ width: '100%' }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <RemoveCircleIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Randy Layhey" secondary="Tester" />
                <ListItemText
                  primary="rayhey@test.com"
                  secondary="226-234-1232"
                />
              </ListItem>
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
    </Box>
  );
};

export default TeamsView;
