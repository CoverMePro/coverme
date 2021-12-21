import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Dialog } from '@mui/material';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import StaffHeaderCells from 'models/HeaderCells/StaffHeadCells';
import { IUserInfo } from 'models/User';
import RegisterUserForm from 'components/forms/user/RegisterUserForm';

import axios from 'utils/axios-intance';

const StaffView: React.FC = () => {
	const [openAddStaff, setOpenAddStaff] = useState<boolean>(false);
	const [staff, setStaff] = useState<IUserInfo[]>([]);

	const user = useTypedSelector(state => state.user);

	const handleAddStaff = () => {
		setOpenAddStaff(true);
	};

	const handleCloseAddStaff = () => {
		setOpenAddStaff(false);
	};

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
			.then(result => {
				setStaff(result.data.users);
			})
			.catch(err => {
				console.log(err);
			});
	}, [user.company]);

	return (
		<Box>
			<EnhancedTable
				title="Staff List"
				data={staff}
				headerCells={StaffHeaderCells}
				id="email"
				onAdd={handleAddStaff}
			/>
			<Dialog open={openAddStaff} onClose={handleCloseAddStaff}>
				<RegisterUserForm onFinish={handleCloseAddStaff} />
			</Dialog>
		</Box>
	);
};

export default StaffView;
