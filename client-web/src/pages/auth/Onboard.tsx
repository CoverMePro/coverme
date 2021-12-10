import React, { useState } from 'react';

import { Box, Paper, Step, StepLabel, Stepper } from '@mui/material';

import onboardBackground from '../../images/onboard-background.jpg';
import logo from '../../images/cover-me-logo.png';

const steps = ['Personal Information', 'Upload Photo'];

const Onboard: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
        alignItems: 'center',
      }}
    >
      <Paper
        sx={{
          width: { xs: '80%', s: 300, md: 600 },
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
      </Paper>
    </Box>
  );
};

export default Onboard;
