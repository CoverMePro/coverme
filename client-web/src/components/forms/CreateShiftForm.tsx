import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import { Box, TextField, Fab, CircularProgress, Typography } from '@mui/material';

import logo from 'images/cover-me-logo.png';
import { validateShift } from 'utils/validation';

import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { IShiftDefinition } from 'models/ShiftDefinition';

import axios from 'utils/axios-intance';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const formatDuration = (value: string) => {
    return value.substring(0, 2) + ':' + value.substring(2);
};

const DurationCustom = React.forwardRef<any, CustomProps>(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            name="shiftDuration"
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            format="##:##"
            placeholder="HH:MM"
            mask={['H', 'H', 'M', 'M']}
            isNumericString
        />
    );
});

interface ICreateShiftFormProps {
    onAddComplete(shiftDef: IShiftDefinition): void;
}

const CreateShiftForm: React.FC<ICreateShiftFormProps> = ({ onAddComplete }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const company = useTypedSelector((state) => state.user.company);

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

            const shiftDef: IShiftDefinition = {
                name: shiftName,
                duration: formatDuration(shiftDuration),
            };

            axios
                .post(
                    `${process.env.REACT_APP_SERVER_API}/company/${company}/shift-definition`,
                    shiftDef
                )
                .then((result) => {
                    enqueueSnackbar('Shift definition created!', {
                        variant: 'success',
                        autoHideDuration: 3000,
                    });

                    onAddComplete(result.data.shiftDef);
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
