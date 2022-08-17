import React, { useEffect, useState } from 'react';

import { Draggable } from '@fullcalendar/interaction';

import { Box, IconButton, Tooltip, Typography, CircularProgress } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DeleteIcon from '@mui/icons-material/Delete';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import QueueIcon from '@mui/icons-material/Queue';

import { IShiftTransaction } from 'models/Shift';
import { IShiftTemplate } from 'models/ShiftTemplate';
import FormDialog from 'components/dialogs/FormDialog';
import CreateManualShiftForm from 'components/forms/CreateManualShiftForm';

interface IEditScheduleProps {
    shiftTransactions: IShiftTransaction[];
    shiftDefs: IShiftTemplate[];
    isLoadingConfirm: boolean;
    isShiftEdit: boolean;
    teamsAndUsers: any;
    onOpenShiftEdit: () => void;
    onConfirmTransactions: () => void;
    onCancelEdits: () => void;
    onCreateShift: (values: any) => void;
}

const EditSchedule: React.FC<IEditScheduleProps> = ({
    shiftTransactions,
    shiftDefs,
    isLoadingConfirm,
    isShiftEdit,
    teamsAndUsers,
    onOpenShiftEdit,
    onConfirmTransactions,
    onCancelEdits,
    onCreateShift,
}) => {
    const [openCreateShift, setOpenCreatShift] = useState<boolean>(false);

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
                            duration: eventEl.dataset.duration,
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

    const handleShiftAdded = (values: any) => {
        onCreateShift(values);
        setOpenCreatShift(false);
    };

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
                                {shiftDefs.map((shiftDef) => {
                                    return (
                                        <div
                                            key={shiftDef.id!}
                                            className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"
                                            data-duration={shiftDef.duration}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: '#006d77',
                                                paddingLeft: '5px',
                                                paddingRight: '5px',
                                                borderColor: '#006d77',
                                                borderRadius: '0',
                                            }}
                                        >
                                            <div className="fc-event-main">{shiftDef.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Box>
                        {isLoadingConfirm ? (
                            <Box sx={{ ml: 5, display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={25} />
                            </Box>
                        ) : (
                            <>
                                <Box>
                                    <Tooltip title="Create Shift" placement="top">
                                        <IconButton
                                            size="large"
                                            onClick={() => setOpenCreatShift(true)}
                                        >
                                            <QueueIcon color="primary" fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
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
            <FormDialog open={openCreateShift} onClose={() => setOpenCreatShift(false)}>
                <CreateManualShiftForm
                    teamsAndUsers={teamsAndUsers}
                    onCompleteAdd={handleShiftAdded}
                />
            </FormDialog>
        </Box>
    );
};

export default EditSchedule;
