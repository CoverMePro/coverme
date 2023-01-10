export type Order = 'asc' | 'desc';

export interface IHeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}

export interface IAction {
    tooltipTitle: string;
    permissionLevel: number;
    icon: any;
}

export interface IUnselectedAction extends IAction {
    onClick: () => void;
}

export interface ISelectedAction extends IAction {
    onClick: (selected: any) => void;
}
