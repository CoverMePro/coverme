import React, { useState } from 'react';

import {
	Box,
	TextField,
	Select,
	Fab,
	Paper,
	FormControl,
	InputLabel,
	FormLabel,
	FormControlLabel,
	RadioGroup,
	Radio
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import loginBackground from '../../images/login-background.jpg';
import logo from '../../images/cover-me-logo.png';

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
			<Paper
				sx={{
					width: { xs: '80%', s: 300, md: 500 },
					borderRadius: 5,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center'
				}}
			>
				<Box
					sx={{
						paddingY: 5,
						width: '80%'
					}}
				>
					<img src={logo} width={100} />
					<h2>Register a User!</h2>
					<Box>
						<TextField
							sx={{ width: '100%' }}
							variant="outlined"
							type="email"
							label="Email"
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Company</InputLabel>
							<Select label="Company"></Select>
						</FormControl>
					</Box>
					{/* <Box sx={{ mt: 2 }}>
						<FormControl component="fieldset">
							<FormLabel component="legend">Role</FormLabel>
							<RadioGroup row aria-label="gender" name="row-radio-buttons-group">
								<FormControlLabel
									value="manager"
									control={<Radio />}
									label="Manager"
								/>
								<FormControlLabel value="staff" control={<Radio />} label="Staff" />
							</RadioGroup>
						</FormControl>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							sx={{ width: '100%' }}
							variant="outlined"
							type="text"
							label="Position"
						/>
					</Box> */}

					<Box sx={{ mt: 3 }}>
						<Fab color="primary" aria-label="add">
							<HowToRegIcon fontSize="large" />
						</Fab>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default RegisterUser;
