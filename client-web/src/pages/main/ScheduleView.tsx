import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'; // must go before plugins
import { EventChangeArg, EventInstance } from '@fullcalendar/common';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin
import interactionPlugin, { EventReceiveArg, EventDragStopArg } from '@fullcalendar/interaction';

import { Box, Checkbox, FormControlLabel, FormGroup, LinearProgress } from '@mui/material';

import axios from 'utils/axios-intance';
import { AxiosResponse } from 'axios';
import { IShift, IShiftTransaction } from 'models/Shift';
import { IShiftDefinition } from 'models/ShiftDefinition';

import 'styles/calendar.css';
import EditSchedule from 'components/scheduler/EditSchedule';

const ScheduleView: React.FC = () => {
    const [teamStaff, setTeamStaff] = useState<any[]>([]);
    const [filteredTeamStaff, setFilteredTeamStaff] = useState<any[]>([]);
    const [shiftDefs, setShiftDefs] = useState<IShiftDefinition[]>([]);
    const [events, setEvents] = useState<EventInput[]>([]);
    const [cachedEvents, setCachedEvents] = useState<EventInput[]>([]);
    const [addedEvents, setAddedEvents] = useState<EventApi[]>([]);
    const [shiftTransactions, setShiftTransactions] = useState<IShiftTransaction[]>([]);
    const [isShiftEdit, setIsShiftEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false);
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
            console.log(resource);
            team = resource.extendedProps.team;
        }

        return team;
    };

    const getEmail = (resourceId: string) => {
        let email = '';
        if (calendarRef.current) {
            let calendarApi = calendarRef.current.getApi();
            const resource = calendarApi.getResourceById(resourceId);
            console.log(resource);
            email = resource.extendedProps.email;
        }

        return email;
    };

    const removeTransaction = (id: string) => {
        const filtedTransactions = shiftTransactions.filter((shift) => shift.instanceId !== id);

        setShiftTransactions(filtedTransactions);
    };

    const changeTransaction = (title: string, eventInstance: EventInstance, resourceId: string) => {
        const filtedTransactions = shiftTransactions.filter(
            (shift) => shift.instanceId !== eventInstance.instanceId
        );

        const changedtransaction: IShiftTransaction = {
            type: 'add',
            name: title,
            instanceId: eventInstance.instanceId,
            userId: getEmail(resourceId),
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
                resourceId: `${shift.teamId}-${shift.userId}`,
            };
        });

        setEvents(formattedEvents);
        setCachedEvents(formattedEvents);
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
                userId: getEmail(dropEvent.event._def.resourceIds[0]),
                teamId: getTeam(dropEvent.event._def.resourceIds[0]),
                instanceId: dropEvent.event._instance.instanceId,
                startDate: dropEvent.event._instance.range.start.toISOString(),
                endDate: dropEvent.event._instance.range.end.toISOString(),
            };

            const newShiftTransactions = [...shiftTransactions, transaction];

            const newEvents = [...addedEvents, dropEvent.event];
            setAddedEvents(newEvents);

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

    const handleShowAllChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowAll(checked);
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
                    userId: getEmail(changedEvent.event._def.resourceIds[0]),
                    teamId: getTeam(changedEvent.event._def.resourceIds[0]),
                    instanceId: changedEvent.event._instance.instanceId,
                    startDate: changedEvent.event._instance.range.start.toISOString(),
                    endDate: changedEvent.event._instance.range.end.toISOString(),
                };

                const newShiftTransactions = [...shiftTransactions, transaction];

                setShiftTransactions(newShiftTransactions);
            } else {
                changeTransaction(
                    changedEvent.event._def.title,
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
            .post(
                `${process.env.REACT_APP_SERVER_API}/company/${user.company!}/shift-transactions`,
                {
                    transactions: shiftTransactions,
                }
            )
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

    const handleCancelEdits = () => {
        if (shiftTransactions.length > 0) {
            setShiftTransactions([]);
            setEvents([...cachedEvents]);

            for (let i = 0, len = addedEvents.length; i < len; i++) {
                addedEvents[i].remove();
            }

            setAddedEvents([]);
        }
        setIsShiftEdit(false);
    };

    const isInTeam = (team: string, userTeams: string[]) => {
        let result = false;
        userTeams.forEach((userTeam) => {
            if (userTeam === team) {
                result = true;
            }
        });
        return result;
    };

    const formatStaff = (staff: any[]) => {
        if (!showAll && user.teams) {
            const filteredStaff = staff.filter((s) => {
                return isInTeam(s.team, user.teams!);
            });
            return filteredStaff;
        } else {
            return staff;
        }
    };

    const getShiftsFromTeams = useCallback(() => {
        setIsLoading(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/${user.company!}/shifts`)
            .then((result: AxiosResponse) => {
                setTeamStaff(result.data.teamStaff);
                setFilteredTeamStaff(formatStaff(result.data.teamStaff));
                setShiftDefs(result.data.shiftDefs);
                formatEvents(result.data.shifts);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user.company]);

    useEffect(() => {
        getShiftsFromTeams();
    }, [getShiftsFromTeams]);

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
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {user.role !== 'staff' && (
                            <EditSchedule
                                shiftTransactions={shiftTransactions}
                                shiftDefs={shiftDefs}
                                isLoadingConfirm={isLoadingConfirm}
                                isShiftEdit={isShiftEdit}
                                onOpenShiftEdit={() => setIsShiftEdit(true)}
                                onConfirmTransactions={handleConfirmTransactions}
                                onCancelEdits={handleCancelEdits}
                            />
                        )}
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={showAll} onChange={handleShowAllChange} />
                                }
                                label="Show All In Company"
                            />
                        </FormGroup>
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
                            resources={!showAll ? filteredTeamStaff : teamStaff}
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
