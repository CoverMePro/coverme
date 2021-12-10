import React from 'react';

import { Box } from '@mui/material';

import loginBackground from '../../images/login-background.jpg';
import RegisterUserForm from 'components/forms/user/RegisterUserForm';

const RegisterUser: React.FC = () => {
	return (
		<Box
			sx={{
				height: '100vh',
				width: '100vw',
				backgroundImage: `url(${loginBackground})`,
				backgroundSize: 'cover',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<RegisterUserForm />
		</Box>
	);
};

export default RegisterUser;
