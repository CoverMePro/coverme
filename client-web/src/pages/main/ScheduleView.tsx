import React, { useEffect, useState, useRef } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction';

import { Box, LinearProgress, IconButton, Tooltip, Typography } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DeleteIcon from '@mui/icons-material/Delete';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import axios from 'utils/axios-intance';
import { AxiosResponse } from 'axios';
import { IShift } from 'models/Shift';

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
    name: string;
    userId: string;
    companyId: string;
    teamId: string;
    startDate: string;
    endDate: string;
}

const ScheduleView: React.FC = () => {
    const [teamStaff, setTeamStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isShiftEdit, setIsShiftEdit] = useState<boolean>(false);

    const [events, setEvents] = useState<any[]>([]);

    const [shiftTransactions, setShiftTransactions] = useState<IShiftTransaction[]>([]);

    const user = useTypedSelector((state) => state.user);

    const calendarRef = useRef<any>(undefined);

    /**
     * Handler for when an event is drop into the calendar. This means an event was ADDED
     * Transaction should be recorded that event was ADDED
     * @param dropEvent - Information on the event that was drop in calendar
     */
    const handleEventReceived = (dropEvent: any) => {
        console.log(dropEvent);

        let team = '';

        if (calendarRef.current) {
            let calendarApi = calendarRef.current.getApi();
            const resource = calendarApi.getResourceById(dropEvent.event._def.resourceIds[0]);
            team = resource.extendedProps.team;

            console.log(team);
        }

        const transaction: IShiftTransaction = {
            type: 'add',
            name: dropEvent.event._def.title,
            userId: dropEvent.event._def.resourceIds[0],
            companyId: user.company!,
            teamId: team,
            instanceId: dropEvent.event._instance.instanceId,
            startDate: dropEvent.event._instance.range.start.toISOString(),
            endDate: dropEvent.event._instance.range.end.toISOString(),
        };

        const newShiftTransactions = [...shiftTransactions, transaction];

        setShiftTransactions(newShiftTransactions);
    };

    const removeTransaction = (id: string) => {
        const filtedTransactions = shiftTransactions.filter((shift) => shift.instanceId !== id);

        setShiftTransactions(filtedTransactions);
    };

    const handleDragStop = (e: any) => {
        console.log(e);
        let trashEl = document.getElementById('fc-trash')!; //as HTMLElement;

        let x1 = trashEl.offsetLeft;
        let x2 = trashEl.offsetLeft + trashEl.offsetWidth;
        let y1 = trashEl.offsetTop;
        let y2 = trashEl.offsetTop + trashEl.offsetHeight;

        if (
            e.jsEvent.pageX >= x1 &&
            e.jsEvent.pageX <= x2 &&
            e.jsEvent.pageY >= y1 &&
            e.jsEvent.pageY <= y2
        ) {
            e.event.remove();
            removeTransaction(e.event._instance.instanceId);
        }
    };

    const handleEventChange = (e: any) => {
        console.log(e);
    };

    const handleConfirmTransactions = () => {
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/shift/transactions`, {
                transactions: shiftTransactions,
            })
            .then(() => {
                console.log('SUCCESS');
            })
            .catch((error) => {
                console.error(error);
            });
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

    useEffect(() => {
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
    }, []);

    useEffect(() => {
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

    useEffect(() => {
        console.log(shiftTransactions);
    }, [shiftTransactions]);

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
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="fc-event-main">Full Shift</div>
                                            </div>
                                            <div
                                                className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="fc-event-main">Half Shift</div>
                                            </div>
                                        </div>
                                    </Box>
                                    <Box>
                                        <Tooltip title="Confirm Edit" placement="top">
                                            <span>
                                                <IconButton
                                                    size="large"
                                                    disabled={shiftTransactions.length === 0}
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
                                                <EditOffIcon color="primary" fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        <div id="fc-trash">
                                            <DeleteIcon fontSize="large" color="primary" />
                                        </div>
                                    </Box>
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
                            editable={true}
                            eventStartEditable={true}
                            eventResizableFromStart={true}
                            eventDurationEditable={true}
                            eventResourceEditable={true}
                            dragRevertDuration={0}
                            eventDragStop={handleDragStop}
                            eventReceive={handleEventReceived}
                            eventAdd={(e) => console.log(e)}
                            eventChange={handleEventChange}
                            droppable={true}
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
