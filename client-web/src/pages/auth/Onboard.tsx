import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Box,
	IconButton,
	Paper,
	Step,
	StepLabel,
	Stepper,
	TextField,
	CircularProgress,
	Fab
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';

import onboardBackground from '../../images/onboard-background.jpg';
import defaultImage from '../../images/default-user.png';
import logo from '../../images/cover-me-logo.png';

const steps = ['Password', 'Personal Information', 'Upload Photo'];

const Onboard: React.FC = () => {
	const [activeStep, setActiveStep] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<Boolean>(false);

	const navigate = useNavigate();

	const handleNext = () => {
		if (activeStep === 3) {
			navigate('/dashboard');
		} else {
			setActiveStep(prevActiveStep => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	return (
		<Box
			sx={{
				height: '100vh',
				width: '100vw',
				backgroundImage: `url(${onboardBackground})`,
				backgroundSize: 'cover',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Paper
				sx={{
					width: { xs: '80%', s: 300, md: 600 },
					borderRadius: 5,
					position: 'relative'
				}}
			>
				{activeStep > 0 && activeStep < 3 && (
					<Box sx={{ position: 'absolute', top: 2, left: 2 }}>
						<IconButton color="primary" onClick={handleBack}>
							<ArrowBackIcon fontSize="large" />
						</IconButton>
					</Box>
				)}

				<Box
					sx={{
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
						<h2>Tell us about yourself!</h2>
						<Stepper activeStep={activeStep}>
							{steps.map((label, index) => {
								const stepProps: { completed?: boolean } = {};
								const labelProps: {
									optional?: React.ReactNode;
								} = {};
								return (
									<Step key={label} {...stepProps}>
										<StepLabel {...labelProps}>{label}</StepLabel>
									</Step>
								);
							})}
						</Stepper>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							width: '80%'
						}}
					>
						{activeStep === 0 && (
							<>
								<TextField
									sx={{ mb: 2, width: '100%' }}
									variant="outlined"
									label="Password"
								/>
								<TextField
									sx={{ mb: 2, width: '100%' }}
									variant="outlined"
									label="Confirm Password"
								/>
							</>
						)}

						{activeStep === 1 && (
							<>
								<TextField
									sx={{ mb: 2, width: '100%' }}
									variant="outlined"
									label="First Name"
								/>
								<TextField
									sx={{ mb: 2, width: '100%' }}
									variant="outlined"
									label="Last Name"
								/>
								<TextField
									sx={{ mb: 2, width: '100%' }}
									variant="outlined"
									label="Phone Number"
								/>
							</>
						)}
						{activeStep === 2 && (
							<>
								<img src={defaultImage} width={100} style={{ borderRadius: 50 }} />
								<p>
									This will be your profile picture for now, Image uploading
									coming soon!
								</p>
							</>
						)}
						{activeStep === 3 && (
							<>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										mb: 5
									}}
								>
									{isLoading ? (
										<>
											<h3>Saving your information...</h3>
											<CircularProgress />
										</>
									) : (
										<>
											<h3>Information saved, You are all set!</h3>
										</>
									)}
								</Box>
							</>
						)}
					</Box>

					<Box sx={{ my: 2 }}>
						{!isLoading && (
							<Fab color="primary" onClick={handleNext}>
								{activeStep === steps.length ? (
									<DoneIcon />
								) : (
									<ArrowForwardIcon fontSize="large" />
								)}
							</Fab>
						)}
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};

export default Onboard;
