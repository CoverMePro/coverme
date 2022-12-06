import { Box } from '@mui/system';
import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    IconButton,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateRange, Range } from 'react-date-range';
import { IShiftRotation, IShiftRotationTransaction } from 'coverme-shared';

// TODO: Utils
const date = new Date();
date.setHours(12, 0, 0, 0);

interface IRotationCreatorProps {
    rotations: IShiftRotation[];
    onCancel: () => void;
    onConfirm: (rotationTransaction: IShiftRotationTransaction) => void;
}

const RotationCreator: React.FC<IRotationCreatorProps> = ({ rotations, onCancel, onConfirm }) => {
    const [editMode, setEditMode] = useState<boolean>(true);
    const [selectedRotationId, setSelectedRotationId] = useState<string>('');
    const [display, setDisplay] = useState<string>('');
    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const handleRotationChange = (event: SelectChangeEvent) => {
        const shiftTemplateId = event.target.value as string;

        setSelectedRotationId(shiftTemplateId);
    };

    const handleDisplay = (selectedRotation: IShiftRotation) => {
        setDisplay(
            `${dateRange[0].startDate?.toDateString()} - ${dateRange[0].endDate?.toDateString()} (${
                selectedRotation.name
            })`
        );
    };

    const handleConfirm = () => {
        const selectedRotation = rotations.find((rot) => rot.id === selectedRotationId);

        if (selectedRotation) {
            const rotationTransaction: IShiftRotationTransaction = {
                startDate: dateRange[0].startDate!,
                endDate: dateRange[0].endDate!,
                rotation: selectedRotation,
            };

            onConfirm(rotationTransaction);
            handleDisplay(selectedRotation);
            setEditMode(false);
        }
    };

    const handleCancel = () => {
        if (display === '') {
            onCancel();
        } else {
            setEditMode(false);
        }
    };

    const isConfirmDisabled = () => {
        return rotations.length === 0;
    };

    return (
        <>
            {editMode ? (
                <Box sx={{ flexGrow: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <>
                            {rotations.length > 0 ? (
                                <>
                                    <Box sx={{ flexGrow: 2, width: '50%' }}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <Box sx={{ mt: 2 }}>
                                                <DateRange
                                                    editableDateInputs={true}
                                                    onChange={(item) =>
                                                        setDateRange([item.selection])
                                                    }
                                                    minDate={new Date()}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={dateRange}
                                                    rangeColors={['#006d77']}
                                                />
                                            </Box>
                                        </LocalizationProvider>
                                    </Box>
                                    <FormControl fullWidth sx={{ width: '50%' }}>
                                        <InputLabel id="shift-template-label">Rotation</InputLabel>
                                        <Select
                                            labelId="shift-template-label"
                                            value={selectedRotationId}
                                            label="Shift Template"
                                            onChange={handleRotationChange}
                                        >
                                            {rotations.map((rotation) => (
                                                <MenuItem key={rotation.id} value={rotation.id}>
                                                    {rotation.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </>
                            ) : (
                                <>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h4">
                                            You do not have any Shift Rotations
                                        </Typography>
                                        <Typography>Please create a Rotation</Typography>
                                    </Box>
                                </>
                            )}
                        </>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Confirm">
                                <IconButton
                                    size="large"
                                    onClick={handleConfirm}
                                    disabled={isConfirmDisabled()}
                                >
                                    <CheckCircleIcon
                                        color={isConfirmDisabled() ? 'disabled' : 'primary'}
                                        fontSize="large"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <IconButton size="large" onClick={handleCancel}>
                                    <CancelIcon color="primary" fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: 'center',
                                    flexGrow: 1,
                                }}
                            >
                                <Typography variant="h4">{display}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Tooltip title="Edit Shift ">
                                    <IconButton size="large" onClick={() => setEditMode(true)}>
                                        <EditIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete Shift ">
                                    <IconButton
                                        size="large"
                                        onClick={() => {
                                            // onDelete(day);
                                        }}
                                    >
                                        <DeleteIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default RotationCreator;
