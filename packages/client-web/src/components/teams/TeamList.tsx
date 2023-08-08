import React from 'react';

import { ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { IUser } from 'coverme-shared';

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
					sx={{ width: '60%' }}
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
						sx={{ width: '100%' }}
						primary={`${user.firstName} ${user.lastName}`}
					/>
					<ListItemText
						sx={{ width: '50%', textAlign: 'left' }}
						primary={user.email}
						secondary={user.phone}
					/>
				</ListItem>
			))}
		</>
	);
};

export default TeamList;
