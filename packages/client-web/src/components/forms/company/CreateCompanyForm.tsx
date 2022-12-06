import React, { useState } from 'react';

import { Paper, Box, Stepper, Step, StepLabel, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import logo from 'images/cover-me-logo.png';

import { ICompanyFormInfo, ICompany } from 'coverme-shared';

import CompanyForm from './form-steps/CompanyForm';
import OwnerForm from './form-steps/OwnerForm';

const STEPS = ['Company Info', 'Owner Info'];

interface ICreateCompanyFormProps {
    onFinish: (success: boolean, company?: ICompany) => void;
}

const CreateCompanyForm: React.FC<ICreateCompanyFormProps> = ({ onFinish }) => {
    const [company, setCompany] = useState<ICompanyFormInfo>({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
    });

    const [step, setStep] = useState<number>(0);

    const handleCompanyFormSuccess = (
        companyName: string,
        companyEmail: string,
        companyPhone: string
    ) => {
        setCompany({
            companyName,
            companyEmail,
            companyPhone,
        });
        setStep(1);
    };

    const handleOwnerFormSuccess = () => {
        setStep(0);
        onFinish(true, {
            name: company.companyName,
            email: company.companyEmail,
            phone: company.companyPhone,
        });
    };

    const handleOwnerFormError = () => {
        setStep(0);
        onFinish(false);
    };

    return (
        <Paper
            sx={{
                width: { xs: '80%', s: 300, md: 500 },
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            {step === 1 && (
                <Box sx={{ position: 'absolute', left: 5, top: 5 }}>
                    <IconButton onClick={() => setStep(0)} size="large">
                        <ArrowBackIcon color="primary" fontSize="large" />
                    </IconButton>
                </Box>
            )}

            <Box
                sx={{
                    paddingY: 5,
                    width: '80%',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <img src={logo} width={100} alt="Cover Me Logo" />
                    <Typography variant="h2">Create a Company!</Typography>
                </Box>
                <Stepper sx={{ my: 2 }} activeStep={step}>
                    {STEPS.map((label, index) => {
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
                {step === 0 && <CompanyForm onSuccess={handleCompanyFormSuccess} />}
                {step === 1 && (
                    <OwnerForm
                        company={company}
                        onSuccess={handleOwnerFormSuccess}
                        onError={handleOwnerFormError}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default CreateCompanyForm;
