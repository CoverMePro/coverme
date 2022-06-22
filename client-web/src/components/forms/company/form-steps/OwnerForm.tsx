import React, { useState } from 'react';

import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { Box, CircularProgress, Fab, TextField, Typography } from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { validateOwner } from 'utils/validations/company';
import axios from 'utils/axios-intance';

interface ICompanyFormProps {
    company: any;
    onSuccess: () => void;
    onError: () => void;
}

const OwnerForm: React.FC<ICompanyFormProps> = ({ company, onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const ownerForm = useFormik({
        initialValues: {
            ownerFirstName: '',
            ownerLastName: '',
            ownerEmail: '',
        },
        validate: validateOwner,
        onSubmit: ({ ownerFirstName, ownerLastName, ownerEmail }) => {
            // Put all necessary info into an object (company and user who owns the company)
            const companyData = {
                company: {
                    name: company.companyName,
                    data: {
                        email: company.companyEmail,
                        phone: company.companyPhone,
                    },
                },
                owner: {
                    email: ownerEmail,
                    data: {
                        firstName: ownerFirstName,
                        lastName: ownerLastName,
                        role: 'owner',
                        position: 'Owner',
                        company: company.companyName,
                    },
                },
            };

            setIsLoading(true);

            axios
                .post(`${process.env.REACT_APP_SERVER_API}/company/create`, companyData)
                .then((result) => {
                    enqueueSnackbar('Company created!', {
                        variant: 'success',
                        autoHideDuration: 3000,
                    });
                    setIsLoading(false);
                    onSuccess();
                })
                .catch((err) => {
                    console.error(err);
                    // hopfully we can do better for unknown error eventually
                    enqueueSnackbar(
                        'An unknow error occured, please try again or contact support.',
                        { variant: 'error', autoHideDuration: 5000 }
                    );
                    setIsLoading(false);
                    onError();
                });
        },
    });

    return (
        <form onSubmit={ownerForm.handleSubmit}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5">Enter the owner of company's information </Typography>
                <Typography variant="body1">
                    (this will be the user who has admin priviliages over company)
                </Typography>
            </Box>
            <Box>
                <TextField
                    sx={{ width: '100%' }}
                    variant="outlined"
                    type="email"
                    label="Email"
                    name="ownerEmail"
                    onChange={ownerForm.handleChange}
                    onBlur={ownerForm.handleBlur}
                    error={
                        ownerForm.touched.ownerEmail &&
                        ownerForm.errors.ownerEmail !== undefined &&
                        ownerForm.errors.ownerEmail !== ''
                    }
                    helperText={ownerForm.touched.ownerEmail ? ownerForm.errors.ownerEmail : ''}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    sx={{ width: '100%' }}
                    variant="outlined"
                    type="text"
                    label="First Name"
                    name="ownerFirstName"
                    onChange={ownerForm.handleChange}
                    onBlur={ownerForm.handleBlur}
                    error={
                        ownerForm.touched.ownerFirstName &&
                        ownerForm.errors.ownerFirstName !== undefined &&
                        ownerForm.errors.ownerFirstName !== ''
                    }
                    helperText={
                        ownerForm.touched.ownerFirstName ? ownerForm.errors.ownerFirstName : ''
                    }
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    sx={{ width: '100%' }}
                    variant="outlined"
                    type="text"
                    label="Last Name"
                    name="ownerLastName"
                    onChange={ownerForm.handleChange}
                    onBlur={ownerForm.handleBlur}
                    error={
                        ownerForm.touched.ownerLastName &&
                        ownerForm.errors.ownerLastName !== undefined &&
                        ownerForm.errors.ownerLastName !== ''
                    }
                    helperText={
                        ownerForm.touched.ownerLastName ? ownerForm.errors.ownerLastName : ''
                    }
                />
            </Box>

            {isLoading ? (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Fab color="primary" type="submit">
                        <ArrowForwardIcon fontSize="large" />
                    </Fab>
                </Box>
            )}
        </form>
    );
};

export default OwnerForm;
