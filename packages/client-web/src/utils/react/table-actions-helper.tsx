import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditRounded';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DeselectIcon from '@mui/icons-material/Deselect';
import { ISelectedAction, IUnselectedAction } from 'coverme-shared';

export const getAddAction = (
	object: string,
	onAdd: () => void,
	permissionLevel: number = 2
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

export const getStaffUnselectAddAction = (
	onClearAssign: () => void,
	permissionLevel: number = 2
): IUnselectedAction[] => {
	return [
		{
			tooltipTitle: `Clear Last Callout`,
			permissionLevel: permissionLevel,
			icon: <DeselectIcon color="primary" fontSize="large" />,
			onClick: onClearAssign,
		},
	];
};

export const getStaffActions = (
	onSelectLastCallout: (selected: any) => void,
	permissionLevel: number = 1
): ISelectedAction[] => {
	return [
		{
			tooltipTitle: `Assign to last called out`,
			permissionLevel: permissionLevel,
			icon: <AssignmentIndIcon color="primary" fontSize="large" />,
			onClick: onSelectLastCallout,
		},
	];
};
