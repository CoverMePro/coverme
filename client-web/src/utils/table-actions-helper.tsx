import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { ISelectedAction, IUnselectedAction } from 'models/TableInfo';

export const getAddAction = (
    onAdd: () => void,
    permissionLevel: number = 2
): IUnselectedAction[] => {
    return [
        {
            tooltipTitle: 'Add Staff',
            permissionLevel: permissionLevel,
            icon: <AddCircleIcon color="primary" fontSize="large" />,
            onClick: onAdd,
        },
    ];
};

export const getDeleteAction = (
    onDelete: (selected: any) => void,
    permissionLevel: number = 2
): ISelectedAction[] => {
    return [
        {
            tooltipTitle: 'Delete Staff',
            permissionLevel: permissionLevel,
            icon: <DeleteIcon color="primary" fontSize="large" />,
            onClick: onDelete,
        },
    ];
};
