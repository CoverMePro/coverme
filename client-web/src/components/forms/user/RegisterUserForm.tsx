import React from 'react';

import {
	Paper,
	Box,
	TextField,
	Fab,
	FormLabel,
	FormControl,
	FormControlLabel,
	InputLabel,
	Select,
	Radio,
	RadioGroup
} from '@mui/material';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from '../../../images/cover-me-logo.png';

const RegisterUserForm: React.FC = () => {
	return (
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
				<Box sx={{ mt: 2 }}>
					<FormControl component="fieldset">
						<FormLabel component="legend">Role</FormLabel>
						<RadioGroup row aria-label="gender" name="row-radio-buttons-group">
							<FormControlLabel value="manager" control={<Radio />} label="Manager" />
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
				</Box>

				<Box sx={{ mt: 3 }}>
					<Fab color="primary" aria-label="add">
						<HowToRegIcon fontSize="large" />
					</Fab>
				</Box>
			</Box>
		</Paper>
	);
};

export default RegisterUserForm;
