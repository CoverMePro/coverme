import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import FullCalendar, { EventInput } from '@fullcalendar/react'; // must go before plugins
import { EventChangeArg, EventInstance } from '@fullcalendar/common';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin
import interactionPlugin, {
    Draggable,
    EventReceiveArg,
    EventDragStopArg,
} from '@fullcalendar/interaction';

import {
    Box,
    LinearProgress,
    IconButton,
    Tooltip,
    Typography,
    CircularProgress,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DeleteIcon from '@mui/icons-material/Delete';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import axios from 'utils/axios-intance';
import { AxiosResponse } from 'axios';
import { IShift } from 'models/Shift';

import 'styles/calendar.css';

const getDuration = (shift: string) => {
    const shiftDuration: any = {
        'Full Shift': '08:00',
        'Half Shift': '04:00',
    };

    return shiftDuration[shift] ?? '08:00';
};

type TransactionType = 'add' | 'remove' | 'change';

interface IShiftTransaction {
    type: TransactionType;
    id?: string;
    instanceId?: string;
    name?: string;
    userId?: string;
    companyId?: string;
    teamId?: string;
    startDate?: string;
    endDate?: string;
}

const ScheduleView: React.FC = () => {
    const [teamStaff, setTeamStaff] = useState<any[]>([]);
    const [events, setEvents] = useState<EventInput[]>([]);
    const [shiftTransactions, setShiftTransactions] = useState<IShiftTransaction[]>([]);

    const [isShiftEdit, setIsShiftEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingConfirm, setIsLoadingConfirm] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const calendarRef = useRef<any>(undefined);

    const { enqueueSnackbar } = useSnackbar();

    // HELPER METHODS
    const getTeam = (resourceId: string) => {
        let team = '';
        if (calendarRef.current) {
            let calendarApi = calendarRef.current.getApi();
            const resource = calendarApi.getResourceById(resourceId);
            team = resource.extendedProps.team;
        }

        return team;
    };

    const removeTransaction = (id: string) => {
        const filtedTransactions = shiftTransactions.filter((shift) => shift.instanceId !== id);

        setShiftTransactions(filtedTransactions);
    };

    const changeTransaction = (eventInstance: EventInstance, resourceId: string) => {
        const filtedTransactions = shiftTransactions.filter(
            (shift) => shift.instanceId !== eventInstance.instanceId
        );

        const changedtransaction: IShiftTransaction = {
            type: 'add',
            instanceId: eventInstance.instanceId,
            userId: resourceId,
            companyId: user.company!,
            teamId: getTeam(resourceId),
            startDate: eventInstance.range.start.toISOString(),
            endDate: eventInstance.range.end.toISOString(),
        };

        setShiftTransactions([...filtedTransactions, changedtransaction]);
    };

    const formatEvents = (shifts: IShift[]) => {
        const formattedEvents = shifts.map((shift) => {
            return {
                id: shift.id,
                title: shift.name,
                start: shift.startDateTime,
                end: shift.endDateTime,
                resourceId: shift.userId,
            };
        });

        setEvents(formattedEvents);
    };

    /**
     * Handler for when an event is drop into the calendar. This means an event was ADDED
     * Transaction should be recorded that event was ADDED
     * @param dropEvent - Information on the event that was drop in calendar
     */
    const handleEventReceived = (dropEvent: EventReceiveArg) => {
        if (dropEvent.event._instance && dropEvent.event._def.resourceIds) {
            const transaction: IShiftTransaction = {
                type: 'add',
                name: dropEvent.event._def.title,
                userId: dropEvent.event._def.resourceIds[0],
                companyId: user.company!,
                teamId: getTeam(dropEvent.event._def.resourceIds[0]),
                instanceId: dropEvent.event._instance.instanceId,
                startDate: dropEvent.event._instance.range.start.toISOString(),
                endDate: dropEvent.event._instance.range.end.toISOString(),
            };

            const newShiftTransactions = [...shiftTransactions, transaction];

            setShiftTransactions(newShiftTransactions);
        } else {
            console.error('ERROR: unable to find event instance and/or resource ids');
        }
    };

    /**
     * Handler when event dragging has stopped
     * This is primarily for when dragging event into the trash icon (to remove)
     * @param draggedEvent - Information on the event that is being dragged
     */
    const handleDragStop = (draggedEvent: EventDragStopArg) => {
        let trashEl = document.getElementById('fc-trash')!; //as HTMLElement;

        let x1 = trashEl.offsetLeft;
        let x2 = trashEl.offsetLeft + trashEl.offsetWidth;
        let y1 = trashEl.offsetTop;
        let y2 = trashEl.offsetTop + trashEl.offsetHeight;

        if (
            draggedEvent.jsEvent.pageX >= x1 &&
            draggedEvent.jsEvent.pageX <= x2 &&
            draggedEvent.jsEvent.pageY >= y1 &&
            draggedEvent.jsEvent.pageY <= y2
        ) {
            // check if this is a shift that is in database or not
            // if so, add a 'remove' transaction instead of deleting the current 'add' transaction of this instance
            if (draggedEvent.event._def.publicId !== '') {
                const transaction: IShiftTransaction = {
                    type: 'remove',
                    id: draggedEvent.event._def.publicId,
                };

                const newShiftTransactions = [...shiftTransactions, transaction];

                setShiftTransactions(newShiftTransactions);
            } else {
                removeTransaction(draggedEvent.event._instance!.instanceId);
            }

            draggedEvent.event.remove();
        }
    };

    /**
     * Handler for when the event changes in the calendar
     * @param changedEvent - Information on the old and new event
     */
    const handleEventChange = (changedEvent: EventChangeArg) => {
        // check if this is a shift that is in database or not
        // if so, add a 'change' transaction instead of changing the current 'add' transaction of this instance
        if (changedEvent.event._instance && changedEvent.event._def.resourceIds) {
            if (changedEvent.event._def.publicId !== '') {
                const transaction: IShiftTransaction = {
                    type: 'change',
                    id: changedEvent.event._def.publicId,
                    userId: changedEvent.event._def.resourceIds[0],
                    companyId: user.company!,
                    teamId: getTeam(changedEvent.event._def.resourceIds[0]),
                    instanceId: changedEvent.event._instance.instanceId,
                    startDate: changedEvent.event._instance.range.start.toISOString(),
                    endDate: changedEvent.event._instance.range.end.toISOString(),
                };

                const newShiftTransactions = [...shiftTransactions, transaction];

                setShiftTransactions(newShiftTransactions);
            } else {
                changeTransaction(
                    changedEvent.event._instance,
                    changedEvent.event._def.resourceIds[0]
                );
            }
        } else {
            console.error('ERROR: unable to find event instance and/or resource ids');
        }
    };

    const handleConfirmTransactions = () => {
        setIsLoadingConfirm(true);
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/shift/transactions`, {
                transactions: shiftTransactions,
            })
            .then(() => {
                enqueueSnackbar('Edits to the schedule have been recorded.', {
                    variant: 'success',
                });
                setShiftTransactions([]);
                getShiftsFromTeams();
            })
            .catch((error) => {
                console.error(error);
                enqueueSnackbar('An error has occured, please try again.', { variant: 'error' });
            })
            .finally(() => {
                setIsLoadingConfirm(false);
            });
    };

    const getShiftsFromTeams = useCallback(() => {
        setIsLoading(true);
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/shift/from-teams`, {
                teams: user.teams ? user.teams : [],
            })
            .then((result: AxiosResponse) => {
                console.log(result.data);
                setTeamStaff(result.data.teamStaff);
                formatEvents(result.data.shifts);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user.teams]);

    useEffect(() => {
        getShiftsFromTeams();
    }, [getShiftsFromTeams]);

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
        <Box sx={{ width: '100%', height: '100%' }}>
            {isLoading ? (
                <>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            my: '10px',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            my: '10px',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            my: '10px',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                </>
            ) : (
                <>
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
                                        <div
                                            id="external-events"
                                            style={{ display: 'flex', gap: '10px' }}
                                        >
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
                                                            disabled={
                                                                shiftTransactions.length === 0
                                                            }
                                                            onClick={handleConfirmTransactions}
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
                                                    <IconButton
                                                        size="large"
                                                        onClick={() => setIsShiftEdit(false)}
                                                    >
                                                        <EditOffIcon
                                                            color="primary"
                                                            fontSize="large"
                                                        />
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
                                    <IconButton size="large" onClick={() => setIsShiftEdit(true)}>
                                        <EditIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>

                    <div>
                        <FullCalendar
                            ref={calendarRef}
                            timeZone="UTC"
                            plugins={[
                                resourceTimelinePlugin,
                                resourceTimegridPlugin,
                                interactionPlugin,
                            ]}
                            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                            initialView="resourceTimelineDay"
                            headerToolbar={{
                                left: 'prev,next',
                                center: 'title',
                                right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
                            }}
                            resourceAreaHeaderContent="Staff"
                            resourceGroupField="team"
                            resources={teamStaff}
                            editable={isShiftEdit}
                            eventStartEditable={isShiftEdit}
                            eventColor="#006d77"
                            eventResizableFromStart={isShiftEdit}
                            eventDurationEditable={isShiftEdit}
                            eventResourceEditable={isShiftEdit}
                            dragRevertDuration={0}
                            eventDragStop={handleDragStop}
                            eventReceive={handleEventReceived}
                            eventChange={handleEventChange}
                            droppable={isShiftEdit}
                            events={events}
                            eventDrop={(e) => console.log(e)}
                            height={'auto'}
                            contentHeight={'auto'}
                        />
                    </div>
                </>
            )}
        </Box>
    );
};

export default ScheduleView;
