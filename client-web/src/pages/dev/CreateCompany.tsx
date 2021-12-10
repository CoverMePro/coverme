import React from 'react';

import { Box } from '@mui/material';

import CreateCompanyForm from 'components/forms/company/CreateCompanyForm';

import loginBackground from '../../images/login-background.jpg';

const CreateCompany: React.FC = () => {
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
			<CreateCompanyForm />
		</Box>
	);
};

export default CreateCompany;
