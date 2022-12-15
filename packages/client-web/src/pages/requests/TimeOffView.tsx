import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Typography } from '@mui/material';

import { staffTimeOffHeadCells, ITimeOffDisplay, ITimeOffRequest, ITimeOff } from 'coverme-shared';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import CreateTimeOffForm from 'components/forms/CreateTimeOffForm';
import PageLoading from 'components/loading/PageLoading';
import FormDialog from 'components/dialogs/FormDialog';

import { formatTimeOffDisplay } from 'utils/formatters/display-formatter';
import { getAddAction } from 'utils/react/table-actions-helper';

import api from 'utils/api';

const TimeOffView: React.FC = () => {
	const [openAddTimeOff, setOpenAddTimeOff] = useState<boolean>(false);
	const [isLoadingTimeOff, setIsLoadingTimeOff] = useState<boolean>(false);

	const [selected, setSelected] = useState<any | undefined>(undefined);
	const [timeOff, setTimeOff] = useState<ITimeOffDisplay[]>([]);

	const user = useTypedSelector((state) => state.user);

	const handleSelectTimeOff = (timeOff: any | undefined) => {
		if (selected === timeOff) {
			setSelected(undefined);
		} else {
			setSelected(timeOff);
		}
	};

	const handleAddTimeOff = () => {
		setOpenAddTimeOff(true);
	};

	const handleCloseAddTimeOff = () => {
		setOpenAddTimeOff(false);
	};

	const handleAddTimeOffSuccessfull = (timeOffRequest: ITimeOffRequest | undefined) => {
		if (timeOffRequest) {
			const newTimeOffs = [...timeOff, formatTimeOffDisplay(timeOffRequest)];
			setTimeOff(newTimeOffs);
		}

		handleCloseAddTimeOff();
	};

	useEffect(() => {
		setIsLoadingTimeOff(true);
		if (user.role === 'staff') {
			api.getAllData<ITimeOffRequest>(`time-off/${user.id!}`)
				.then((timeOffRequests) => {
					const timeOffDisplays: ITimeOffDisplay[] = [];

					timeOffRequests.forEach((timeOff) => {
						timeOffDisplays.push(formatTimeOffDisplay(timeOff));
					});

					setTimeOff([...timeOffDisplays]);
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => setIsLoadingTimeOff(false));
		} else {
			api.postGetAllData<ITimeOffRequest>(`time-off/from-teams`, {
				teams: user.teams,
			})
				.then((timeOffRequests) => {
					const timeOffDisplays: ITimeOffDisplay[] = [];

					timeOffRequests.forEach((timeOff) => {
						timeOffDisplays.push(formatTimeOffDisplay(timeOff));
					});

					setTimeOff([...timeOffDisplays]);
				})
				.catch((err) => {
					console.error(err);
				})
				.finally(() => setIsLoadingTimeOff(false));
		}
	}, [user]);

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<Typography variant="h1">Leave Requests</Typography>
			</Box>
			{isLoadingTimeOff ? (
				<PageLoading />
			) : (
				<EnhancedTable
					headerCells={staffTimeOffHeadCells}
					id="id"
					data={timeOff}
					onSelect={handleSelectTimeOff}
					selected={selected}
					unSelectedActions={getAddAction('Request', handleAddTimeOff, 0)}
					selectedActions={[]}
				/>
			)}
			<FormDialog open={openAddTimeOff} onClose={handleCloseAddTimeOff}>
				<CreateTimeOffForm onFinish={handleAddTimeOffSuccessfull} />
			</FormDialog>
		</>
	);
};

export default TimeOffView;
