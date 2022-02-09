import React, { useEffect } from 'react';

import { Box, IconButton, Tooltip, Typography, CircularProgress } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DeleteIcon from '@mui/icons-material/Delete';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { IShiftTransaction } from 'models/Shift';
import { Draggable } from '@fullcalendar/interaction';

interface IEditScheduleProps {
    shiftTransactions: IShiftTransaction[];
    isLoadingConfirm: boolean;
    isShiftEdit: boolean;
    onOpenShiftEdit: () => void;
    onConfirmTransactions: () => void;
    onCancelEdits: () => void;
}

const getDuration = (shift: string) => {
    const shiftDuration: any = {
        'Full Shift': '08:00',
        'Half Shift': '04:00',
    };

    return shiftDuration[shift] ?? '08:00';
};

const EditSchedule: React.FC<IEditScheduleProps> = ({
    shiftTransactions,
    isLoadingConfirm,
    isShiftEdit,
    onOpenShiftEdit,
    onConfirmTransactions,
    onCancelEdits,
}) => {
    useEffect(() => {
        // Create draggable events that can go into the calendar
        let drag: Draggable;
        if (isShiftEdit) {
            const containerEl = document.getElementById('external-events');

            if (containerEl) {
                drag = new Draggable(containerEl, {
                    itemSelector: '.fc-event',
                    eventData: function (eventEl: any) {
                        return {
                            title: eventEl.innerText,
                            duration: getDuration(eventEl.innerText),
                        };
                    },
                });
            }
        }

        return () => {
            if (drag) {
                drag.destroy();
            }
        };
    }, [isShiftEdit]);

    return (
        <Box sx={{ marginBottom: '24px' }}>
            {isShiftEdit ? (
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Typography variant="h3">Shifts</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'center',
                            }}
                        >
                            <div id="external-events" style={{ display: 'flex', gap: '10px' }}>
                                <div
                                    className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#006d77',
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        borderColor: '#006d77',
                                        borderRadius: '0',
                                    }}
                                >
                                    <div className="fc-event-main">Full Shift</div>
                                </div>
                                <div
                                    className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#006d77',
                                        paddingLeft: '5px',
                                        paddingRight: '5px',
                                        borderColor: '#006d77',
                                        borderRadius: '0',
                                    }}
                                >
                                    <div className="fc-event-main">Half Shift</div>
                                </div>
                            </div>
                        </Box>
                        {isLoadingConfirm ? (
                            <Box sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={25} />
                            </Box>
                        ) : (
                            <>
                                <Box>
                                    <Tooltip title="Confirm Edit" placement="top">
                                        <span>
                                            <IconButton
                                                size="large"
                                                disabled={shiftTransactions.length === 0}
                                                onClick={onConfirmTransactions}
                                            >
                                                <FactCheckIcon
                                                    color={
                                                        shiftTransactions.length === 0
                                                            ? 'disabled'
                                                            : 'primary'
                                                    }
                                                    fontSize="large"
                                                />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                                <Box>
                                    <Tooltip title="Cancel Edit" placement="top">
                                        <IconButton size="large" onClick={onCancelEdits}>
                                            <EditOffIcon color="primary" fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Box>
                                    <div id="fc-trash">
                                        <DeleteIcon fontSize="large" color="primary" />
                                    </div>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Tooltip title="Edit Schedule" placement="top">
                        <IconButton size="large" onClick={onOpenShiftEdit}>
                            <EditIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};

export default EditSchedule;
