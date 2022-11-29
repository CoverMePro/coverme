import React, { useState } from 'react';

import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { Box, CircularProgress, Fab, TextField, Typography } from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { validateCompany } from 'utils/validations/company';

import axios from 'utils/axios-intance';

interface ICompanyFormProps {
    onSuccess: (companyName: string, companyEmail: string, companyPhone: string) => void;
}

const CompanyForm: React.FC<ICompanyFormProps> = ({ onSuccess }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const {
        handleSubmit,
        handleChange,
        handleBlur,
        setValues,
        validateForm,
        values,
        touched,
        errors,
    } = useFormik({
        initialValues: {
            companyName: '',
            companyEmail: '',
            companyPhone: '',
        },
        validate: validateCompany,
        onSubmit: ({ companyName, companyEmail, companyPhone }) => {
            setIsLoading(true);

            axios
                .get(`${process.env.REACT_APP_SERVER_API}/company/check/${companyName}`)
                .then((result) => {
                    if (result.data.exists === false) {
                        onSuccess(companyName, companyEmail, companyPhone);
                    } else {
                        enqueueSnackbar('A company with that name already exists.', {
                            variant: 'error',
                            autoHideDuration: 5000,
                        });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    enqueueSnackbar(
                        'An unknow error occured, please try again or contact support.',
                        { variant: 'error', autoHideDuration: 5000 }
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h5">Enter infomation about the company</Typography>
            </Box>

            <Box>
                <TextField
                    sx={{ width: '100%' }}
                    variant="outlined"
                    type="text"
                    label="Company Name"
                    name="companyName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.companyName &&
                        errors.companyName !== undefined &&
                        errors.companyName !== ''
                    }
                    helperText={touched.companyName ? errors.companyName : ''}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    sx={{ width: '100%' }}
                    variant="outlined"
                    type="email"
                    label="Contact Email"
                    name="companyEmail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                        touched.companyEmail &&
                        errors.companyEmail !== undefined &&
                        errors.companyEmail !== ''
                    }
                    helperText={touched.companyEmail ? errors.companyEmail : ''}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <MuiPhoneNumber
                    sx={{ width: '100%' }}
                    variant="outlined"
                    type="text"
                    defaultCountry={'ca'}
                    disableDropdown
                    label="Phone Number"
                    name="companyPhone"
                    onChange={(e) => {
                        setValues({
                            ...values,
                            companyPhone: e as string,
                        });
                        validateForm();
                    }}
                    onBlur={handleBlur}
                    error={
                        touched.companyPhone &&
                        errors.companyPhone !== undefined &&
                        errors.companyPhone !== ''
                    }
                    helperText={touched.companyPhone ? errors.companyPhone : ''}
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

export default CompanyForm;
