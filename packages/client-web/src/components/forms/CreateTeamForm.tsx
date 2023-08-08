import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import {
	Box,
	TextField,
	Fab,
	Checkbox,
	Autocomplete,
	CircularProgress,
	Typography,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';
import { validateCreateTeam } from 'utils/validations/team';
import api from 'utils/api';

import { ITeam, IUser } from 'coverme-shared';

interface ICreateFormProps {
	onFinish: (team?: ITeam) => void;
}

const CreateTeamForm: React.FC<ICreateFormProps> = ({ onFinish }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [managers, setManagers] = useState<IUser[]>([]);
	const [teamColor, setTeamColor] = useState<string>(
		Math.floor(Math.random() * 16777215).toString(16)
	);
	const [staff, setStaff] = useState<IUser[]>([]);
	const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
	const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

	const user = useTypedSelector((state) => state.user);

	const { enqueueSnackbar } = useSnackbar();

	const handleChangeSelectUsers = (users: IUser[], isStaff: boolean) => {
		const userIds = users.map((user) => {
			return user.id!;
		});

		isStaff ? setSelectedStaff(userIds) : setSelectedManagers(userIds);
	};

	// TODO: Make validation better
	const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
		initialValues: {
			teamName: '',
		},
		validate: validateCreateTeam,
		onSubmit: (values: any) => {
			setIsLoading(true);
			api.postCreateData<ITeam>(`teams`, {
				id: values.teamName,
				owner: user.id!,
				managers: selectedManagers,
				staff: selectedStaff,
				color: `#${teamColor}`,
			})
				.then((teamAdded) => {
					enqueueSnackbar('Team created.', {
						variant: 'success',
					});
					onFinish(teamAdded);
				})
				.catch((err) => {
					if (err.response?.status === 403) {
						enqueueSnackbar('A team with this name already exists', {
							variant: 'error',
						});
					} else {
						console.error(err);
						enqueueSnackbar('An error has occured, please try again', {
							variant: 'error',
						});
						onFinish();
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		},
	});

	const handleColorChange = (color: any, event: any) => {
		setTeamColor(color.hex);
	};

	useEffect(() => {
		// api.getAllData<IUser>(`users`)
		// 	.then((users) => {
		// 		const retrievedManagers = users.filter((user) => user.role === 'manager');
		// 		const retreivedStaff = users.filter((user) => user.role === 'staff');
		// 		setManagers(retrievedManagers);
		// 		setStaff(retreivedStaff);
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
	}, []);

	return (
		<Box
			sx={{
				width: { xs: '80%', s: 300, md: 500 },
				borderRadius: 5,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
			}}
		>
			<Box
				sx={{
					paddingY: 5,
					width: '80%',
				}}
			>
				<img src={logo} width={100} alt="Cover Me Logo" />
				<Typography sx={{ mb: 2 }} variant="h2">
					Create a Team!
				</Typography>
				<form onSubmit={handleSubmit}>
					<Box>
						<TextField
							sx={{ width: '100%' }}
							variant="outlined"
							type="text"
							name="teamName"
							label="Team Name"
							onChange={handleChange}
							onBlur={handleBlur}
							error={
								touched.teamName &&
								errors.teamName !== undefined &&
								errors.teamName !== ''
							}
							helperText={touched.teamName ? errors.teamName : ''}
						/>
					</Box>
					<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
						<ChromePicker color={teamColor} onChange={handleColorChange} disableAlpha />
					</Box>
					<Box sx={{ mt: 2 }}>
						<Autocomplete
							multiple
							options={managers}
							disableCloseOnSelect
							getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
							renderOption={(props, option, { selected }) => (
								<li {...props}>
									<Checkbox
										icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
										checkedIcon={<CheckBoxIcon fontSize="small" />}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option.firstName} {option.lastName}
								</li>
							)}
							renderInput={(params) => <TextField {...params} label="Managers" />}
							onChange={(e, val) => handleChangeSelectUsers(val, false)}
						/>
					</Box>
					<Box sx={{ mt: 2 }}>
						<Autocomplete
							multiple
							options={staff}
							disableCloseOnSelect
							getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
							renderOption={(props, option, { selected }) => (
								<li {...props}>
									<Checkbox
										icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
										checkedIcon={<CheckBoxIcon fontSize="small" />}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option.firstName} {option.lastName}
								</li>
							)}
							renderInput={(params) => <TextField {...params} label="Staff" />}
							onChange={(e, val) => handleChangeSelectUsers(val, true)}
						/>
					</Box>

					<Box sx={{ mt: 3 }}>
						{isLoading ? (
							<CircularProgress />
						) : (
							<Fab color="primary" aria-label="Register User" type="submit">
								<HowToRegIcon fontSize="large" />
							</Fab>
						)}
					</Box>
				</form>
			</Box>
		</Box>
	);
};

export default CreateTeamForm;
