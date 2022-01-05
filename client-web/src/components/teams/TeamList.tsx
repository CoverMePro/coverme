import React from 'react';

import { IUserInfo } from 'models/User';
import { ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

interface ITeamListProps {
    staff: IUserInfo[];
}

const TeamList: React.FC<ITeamListProps> = ({ staff }) => {
    return (
        <>
            {staff.map((user) => (
                <ListItem
                    key={user.email!}
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
                        primary={`${user.firstName} ${user.lastName}`}
                        secondary={user.position}
                    />
                    <ListItemText primary={user.email} secondary={user.phoneNo} />
                </ListItem>
            ))}
        </>
    );
};

export default TeamList;
