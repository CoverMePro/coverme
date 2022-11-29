import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DurationCustom from 'components/number-formats/DurationCustom';
import { IShiftDetail } from 'models/ShiftRotation';
import { IShiftTemplate } from 'models/ShiftTemplate';
import { formatAMPM, formatDurationClean } from 'utils/formatters/dateTime-formatter';

interface IRotationShiftDayProps {
    day: string;
    shifts: IShiftTemplate[];
    onAdd: (day: string, details: IShiftDetail) => void;
    onDelete: (day: string) => void;
    details: IShiftDetail | undefined;
}

const date = new Date();
date.setHours(12, 0, 0, 0);

const RotationShiftDay: React.FC<IRotationShiftDayProps> = ({
    day,
    shifts,
    onAdd,
    onDelete,
    details,
}) => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [manualInput, setManualInput] = useState<boolean>(false);
    const [selectedShiftTemplateId, setSelectedShiftTemplateId] = useState<string>('');
    const [duration, setDuration] = useState<string>();
    const [timeValue, setTimeValue] = useState<Date>(date);

    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);

    const handleToggleManualInput = () => {
        const newManualInput = !manualInput;
        setManualInput(newManualInput);
    };

    const handleChange = (event: any) => {
        setDuration(event.target.value);
    };

    const handleShiftTemplateChange = (event: SelectChangeEvent) => {
        const shiftTemplateId = event.target.value as string;

        setSelectedShiftTemplateId(shiftTemplateId);
    };

    const handleConfirm = () => {
        let newHour: number = 12;
        let newMinute: number = 0;
        let shiftName: string = 'Manual shift';
        let newDuration = duration as string;

        if (manualInput) {
            newHour = timeValue.getHours();
            newMinute = timeValue.getMinutes();
        } else {
            const shiftTemplate = shifts.find((shift) => shift.id === selectedShiftTemplateId);

            if (shiftTemplate) {
                shiftName = shiftTemplate.name;
                newHour = shiftTemplate.startTimeHours;
                newMinute = shiftTemplate.startTimeMinutes;
                newDuration = shiftTemplate.duration;

                setDuration(newDuration);
            }
        }

        const details: IShiftDetail = {
            name: shiftName,
            duration: newDuration as string,
            timeHour: newHour,
            timeMinute: newMinute,
        };

        onAdd(day.toLowerCase(), details);

        setHours(newHour);
        setMinutes(newMinute);

        setOpenEdit(false);
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <Typography variant="h3" sx={{ width: '20%' }}>
                {day}
            </Typography>
            {details === undefined || openEdit ? (
                <>
                    {openEdit ? (
                        <Box sx={{ flexGrow: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                {manualInput ? (
                                    <>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker
                                                label="Start Time"
                                                value={timeValue}
                                                onChange={(newValue) => {
                                                    if (newValue) {
                                                        setTimeValue(newValue);
                                                    }
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>

                                        <TextField
                                            sx={{ width: '50%' }}
                                            label="Duration"
                                            onChange={handleChange}
                                            name="shiftDuration"
                                            id="formatted-numberformat-input"
                                            InputProps={{
                                                inputComponent: DurationCustom as any,
                                            }}
                                            variant="outlined"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <FormControl fullWidth>
                                            <InputLabel id="shift-template-label">
                                                Shift Template
                                            </InputLabel>
                                            <Select
                                                labelId="shift-template-label"
                                                value={selectedShiftTemplateId}
                                                label="Shift Template"
                                                onChange={handleShiftTemplateChange}
                                            >
                                                {shifts.map((shift) => (
                                                    <MenuItem key={shift.id} value={shift.id}>
                                                        {shift.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </>
                                )}

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Confirm">
                                        <IconButton size="large" onClick={handleConfirm}>
                                            <CheckCircleIcon color="primary" fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        title={manualInput ? 'Shift Template' : 'Manual Input'}
                                    >
                                        <IconButton size="large" onClick={handleToggleManualInput}>
                                            {manualInput ? (
                                                <AutoStoriesIcon color="primary" fontSize="large" />
                                            ) : (
                                                <DesignServicesIcon
                                                    color="primary"
                                                    fontSize="large"
                                                />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                        <IconButton
                                            size="large"
                                            onClick={() => {
                                                setOpenEdit(false);
                                            }}
                                        >
                                            <CancelIcon color="primary" fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Tooltip title="Add Shift ">
                                <IconButton
                                    size="large"
                                    onClick={() => {
                                        setOpenEdit(true);
                                    }}
                                >
                                    <AddCircleIcon color="primary" fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </>
            ) : (
                <>
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
                                <Typography variant="h4">{formatAMPM(hours, minutes)}</Typography>
                                <Typography variant="h4">
                                    {formatDurationClean(duration!)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Tooltip title="Edit Shift ">
                                    <IconButton
                                        size="large"
                                        onClick={() => {
                                            setOpenEdit(true);
                                        }}
                                    >
                                        <EditIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete Shift ">
                                    <IconButton
                                        size="large"
                                        onClick={() => {
                                            onDelete(day);
                                        }}
                                    >
                                        <DeleteIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default RotationShiftDay;
