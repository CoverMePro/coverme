import React from 'react';
import { Box, TableHead, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IHeadCell, Order, IUser } from 'coverme-shared';

interface IEnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IUser) => void;
    order: Order;
    orderBy: string;
    headCells: IHeadCell[];
}

const EnhancedTableHead: React.FC<IEnhancedTableProps> = ({
    order,
    orderBy,
    headCells,
    onRequestSort,
}) => {
    const createSortHandler = (property: keyof IUser) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell></TableCell>
                {headCells.map((headCell: IHeadCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable ? (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc'
                                            ? 'sorted descending'
                                            : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        ) : (
                            <>{headCell.label}</>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default EnhancedTableHead;
