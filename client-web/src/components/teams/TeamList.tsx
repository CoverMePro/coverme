import React from 'react';

import { IUser } from 'models/User';
import { ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PermissionCheck from 'components/auth/PermissionCheck';

interface ITeamListProps {
    staff: IUser[];
    onRemoveUser: (user: IUser) => void;
}

const TeamList: React.FC<ITeamListProps> = ({ staff, onRemoveUser }) => {
    return (
        <>
            {staff.map((user) => (
                <ListItem
                    key={user.email!}
                    sx={{ width: '100%' }}
                    secondaryAction={
                        <PermissionCheck permissionLevel={2}>
                            <IconButton
                                onClick={() => onRemoveUser(user)}
                                edge="end"
                                aria-label="delete"
                            >
                                <RemoveCircleIcon color="primary" />
                            </IconButton>
                        </PermissionCheck>
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
                    <ListItemText
                        sx={{ width: '50%' }}
                        primary={user.email}
                        secondary={user.phoneNo}
                    />
                </ListItem>
            ))}
        </>
    );
};

export default TeamList;
