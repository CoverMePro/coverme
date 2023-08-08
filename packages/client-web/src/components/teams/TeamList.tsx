import React from 'react';

import { ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { IStaff, IUser } from 'coverme-shared';

import PermissionCheck from 'components/auth/PermissionCheck';

interface ITeamListProps {
	members: IUser[] | IStaff[];
	onRemoveUser: (user: IUser | IStaff) => void;
}

const TeamList: React.FC<ITeamListProps> = ({ members, onRemoveUser }) => {
	return (
		<>
			{members.map((member) => (
				<ListItem
					key={member.id}
					sx={{ width: '100%' }}
					secondaryAction={
						<PermissionCheck permissionLevel={2}>
							<IconButton
								onClick={() => onRemoveUser(member)}
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
						primary={`${member.firstName} ${member.lastName}`}
					/>
					<ListItemText
						sx={{ width: '100%', textAlign: 'left' }}
						primary={member.phone}
					/>
				</ListItem>
			))}
		</>
	);
};

export default TeamList;
