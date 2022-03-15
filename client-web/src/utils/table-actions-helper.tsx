import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { ISelectedAction, IUnselectedAction } from 'models/TableInfo';

export const getAddAction = (onAdd: () => void): IUnselectedAction[] => {
    return [
        {
            tooltipTitle: 'Add Staff',
            permissionLevel: 2,
            icon: <AddCircleIcon color="primary" fontSize="large" />,
            onClick: onAdd,
        },
    ];
};

export const getDeleteAction = (onDelete: (selected: any) => void): ISelectedAction[] => {
    return [
        {
            tooltipTitle: 'Delete Staff',
            permissionLevel: 2,
            icon: <DeleteIcon color="primary" fontSize="large" />,
            onClick: onDelete,
        },
    ];
};
