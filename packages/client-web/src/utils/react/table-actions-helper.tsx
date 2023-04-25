import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditRounded';
import { ISelectedAction, IUnselectedAction } from 'coverme-shared';

export const getAddAction = (
	object: string,
	onAdd: () => void,
	permissionLevel: number = 1
): IUnselectedAction[] => {
	return [
		{
			tooltipTitle: `Add ${object}`,
			permissionLevel: permissionLevel,
			icon: <AddCircleIcon color="primary" fontSize="large" />,
			onClick: onAdd,
		},
	];
};

export const getDeleteAction = (
	object: string,
	onDelete: (selected: any) => void,
	permissionLevel: number = 1
): ISelectedAction[] => {
	return [
		{
			tooltipTitle: `Delete ${object}`,
			permissionLevel: permissionLevel,
			icon: <DeleteIcon color="primary" fontSize="large" />,
			onClick: onDelete,
		},
	];
};

export const getEditDeleteAction = (
	object: string,
	onDelete: (selected: any) => void,
	onEdit: (selected: any) => void,
	permissionLevel: number = 1
): ISelectedAction[] => {
	return [
		{
			tooltipTitle: `Edit ${object}`,
			permissionLevel: permissionLevel,
			icon: <EditIcon color="primary" fontSize="large" />,
			onClick: onEdit,
		},
		{
			tooltipTitle: `Delete ${object}`,
			permissionLevel: permissionLevel,
			icon: <DeleteIcon color="primary" fontSize="large" />,
			onClick: onDelete,
		},
	];
};
