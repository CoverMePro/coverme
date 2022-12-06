import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { Box, CircularProgress, Fab, TextField } from '@mui/material';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import FormCard from './FormCard';
import RotationShiftDay from 'components/shifts/RotationShiftDay';
import { IShiftDetail, IShiftRotation, IShiftTemplate } from 'coverme-shared';
import { validateCreateRotation } from 'utils/validations/createShift';
import axios from 'utils/axios-intance';

interface ICreateWeekRotationFormProps {
    shifts: IShiftTemplate[];
    onAddComplete(shiftDef: IShiftRotation): void;
}

interface IWeekDetails {
    [key: string]: IShiftDetail;
}

const CreateWeekRotationForm: React.FC<ICreateWeekRotationFormProps> = ({
    shifts,
    onAddComplete,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [shiftDetails, setShiftDetails] = useState<IWeekDetails>({});

    const { enqueueSnackbar } = useSnackbar();

    const handleAddShiftDetail = (day: string, details: IShiftDetail) => {
        const newShitDetails = { ...shiftDetails };
        newShitDetails[day] = details;
        setShiftDetails(newShitDetails);
    };

    const handleDeleteShiftDetails = (day: string) => {
        const newShitDetails = { ...shiftDetails };
        delete newShitDetails[day.toLocaleLowerCase()];
        setShiftDetails(newShitDetails);
    };

    const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
        initialValues: {
            shiftName: '',
        },
        validate: validateCreateRotation,
        onSubmit: (shiftValues: any) => {
            setIsLoading(true);
            const { shiftName } = shiftValues;

            const shiftRotation: IShiftRotation = {
                name: shiftName,
                shifts: shiftDetails,
            };

            axios
                .post(`${process.env.REACT_APP_SERVER_API}/shift-rotations`, shiftRotation)
                .then((result) => {
                    enqueueSnackbar('Shift definition created!', {
                        variant: 'success',
                        autoHideDuration: 3000,
                    });

                    onAddComplete(result.data.shiftRotation);
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
        <FormCard title="Create a Weekly Rotation" s={700} md={1000}>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        mt: 2,
                        width: '100%',
                        px: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
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
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        width: '100%',
                        px: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <RotationShiftDay
                        shifts={shifts}
                        day="Monday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['monday']}
                    />
                    <RotationShiftDay
                        shifts={shifts}
                        day="Tuesday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['tuesday']}
                    />
                    <RotationShiftDay
                        shifts={shifts}
                        day="Wednesday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['wednesday']}
                    />
                    <RotationShiftDay
                        shifts={shifts}
                        day="Thursday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['thursday']}
                    />
                    <RotationShiftDay
                        shifts={shifts}
                        day="Friday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['friday']}
                    />
                    <RotationShiftDay
                        shifts={shifts}
                        day="Saturday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['saturday']}
                    />
                    <RotationShiftDay
                        shifts={shifts}
                        day="Sunday"
                        onAdd={handleAddShiftDetail}
                        onDelete={handleDeleteShiftDetails}
                        details={shiftDetails['sunday']}
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
        </FormCard>
    );
};

export default CreateWeekRotationForm;
