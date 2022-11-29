export interface IHeaderCells<T> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
    numeric: boolean;
    capitalize: boolean;
    sortable: boolean;
}
