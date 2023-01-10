import { ITradeDisplay } from '../displays/TradeDisplay';
import { IHeaderCells } from './HeaderCells';

export const staffTradeRequestHeadCells: IHeaderCells<ITradeDisplay>[] = [
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Request Date',
    },
    {
        id: 'tradeWithUser',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Trading with',
    },
    {
        id: 'tradingShift',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Shift Trading',
    },
    {
        id: 'receiveShift',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Shift Receiving',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Status',
    },
];

export const managerTradeRequestHeadCells: IHeaderCells<ITradeDisplay>[] = [
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: true,
        label: 'Request Date',
    },
    {
        id: 'tradeWithUser',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Trading with',
    },
    {
        id: 'tradingShift',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Shift Trading',
    },
    {
        id: 'receiveShift',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Shift Receiving',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        capitalize: false,
        sortable: false,
        label: 'Status',
    },
];
