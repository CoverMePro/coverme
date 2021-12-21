import React from 'react';

import { Box, TableHead, TableRow, TableCell, TableSortLabel, Checkbox } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { IHeadCell, Order } from 'models/TableInfo';
import { IUserInfo } from 'models/User';

interface IEnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IUserInfo) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	headCells: IHeadCell[];
}

const EnhancedTableHead: React.FC<IEnhancedTableProps> = ({
	numSelected,
	order,
	orderBy,
	rowCount,
	headCells,
	onRequestSort,
	onSelectAllClick
}) => {
	const createSortHandler = (property: keyof IUserInfo) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts'
						}}
					/>
				</TableCell>
				{headCells.map((headCell: IHeadCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

export default EnhancedTableHead;
