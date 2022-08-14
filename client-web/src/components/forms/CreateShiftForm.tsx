import React, { useState } from 'react';

import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import { Box, TextField, Fab, CircularProgress, Typography } from '@mui/material';

import MoreTimeIcon from '@mui/icons-material/MoreTime';

import logo from 'images/cover-me-logo.png';

import DurationCustom from 'components/number-formats/DurationCustom';

import { IShiftTemplate } from 'models/ShiftTemplate';

import { validateShift } from 'utils/validations/shift';
import { formatDuration } from 'utils/formatters/dateTime-formatter';
import axios from 'utils/axios-intance';

interface ICreateShiftFormProps {
    onAddComplete(shiftDef: IShiftTemplate): void;
}

const CreateShiftForm: React.FC<ICreateShiftFormProps> = ({ onAddComplete }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
        initialValues: {
            shiftName: '',
            shiftDuration: '',
        },
        validate: validateShift,
        onSubmit: (shiftValues: any) => {
            setIsLoading(true);
            const { shiftName, shiftDuration } = shiftValues;

            const shiftTemplate: IShiftTemplate = {
                name: shiftName,
                duration: formatDuration(shiftDuration),
            };

            axios
                .post(`${process.env.REACT_APP_SERVER_API}/shift-templates`, shiftTemplate)
                .then((result) => {
                    enqueueSnackbar('Shift definition created!', {
                        variant: 'success',
                        autoHideDuration: 3000,
                    });

                    onAddComplete(result.data.shiftTemplate);
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
                    Define a Shift
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            sx={{ width: '50%' }}
                            variant="outlined"
                            type="text"
                            name="shiftName"
                            label="Shift Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.shiftName &&
                                errors.shiftName !== undefined &&
                                errors.shiftName !== ''
                            }
                            helperText={touched.shiftName ? errors.shiftName : ''}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            sx={{ width: '50%' }}
                            label="Duration"
                            onChange={handleChange}
                            name="shiftDuration"
                            id="formatted-numberformat-input"
                            InputProps={{
                                inputComponent: DurationCustom as any,
                            }}
                            onBlur={handleBlur}
                            error={
                                touched.shiftDuration &&
                                errors.shiftDuration !== undefined &&
                                errors.shiftDuration !== ''
                            }
                            helperText={touched.shiftDuration ? errors.shiftDuration : ''}
                            variant="outlined"
                        />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Fab color="primary" aria-label="Register User" type="submit">
                                <MoreTimeIcon fontSize="large" />
                            </Fab>
                        )}
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default CreateShiftForm;
