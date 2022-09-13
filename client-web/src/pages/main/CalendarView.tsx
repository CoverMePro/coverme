import React, { useEffect, useCallback, useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import FullCalendar, { EventInput } from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

import { IShift } from 'models/Shift';
import { ITimeOff } from 'models/TimeOff';

import PageLoading from 'components/loading/PageLoading';

import axios from 'utils/axios-intance';
import { AxiosResponse } from 'axios';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PermissionCheck from 'components/auth/PermissionCheck';
import DataFilter from 'components/shared/DataFilter';

const CalendarView: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<EventInput[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventInput[]>([]);

    const [filter, setFilter] = useState<string>('company');

    const user = useTypedSelector((state) => state.user);

    const filterEvents = useCallback(
        (events: EventInput[], filterValue: string) => {
            const newEvents: EventInput[] = [];

            events.forEach((event) => {
                const shiftInfo = event.resourceId!.split('-');

                if (filterValue === 'teams') {
                    if (user.teams.findIndex((team) => team === shiftInfo[0]) !== -1) {
                        newEvents.push(event);
                    }
                } else if (filterValue === 'personal') {
                    if (user.id === shiftInfo[1]) {
                        newEvents.push(event);
                    }
                } else {
                    newEvents.push(event);
                }
            });

            return newEvents;
        },
        [user.id, user.teams]
    );

    const formatEvents = useCallback(
        (shifts: IShift[], timeOff: ITimeOff[]) => {
            const formattedShifts = shifts.map((shift) => {
                if (shift.userId === '') return {};
                return {
                    id: shift.id,
                    title: `${shift.name} (${
                        shift.userName !== '' ? shift.userName : 'unclaimed'
                    })`,
                    start: shift.startDateTime,
                    end: shift.endDateTime,
                    resourceId: `${shift.teamId}-${shift.userId}`,
                    color: '#006d77',
                };
            });

            const formattedTimeOff: any[] = [];

            timeOff.forEach((to) => {
                to.teams.forEach((team) => {
                    formattedTimeOff.push({
                        id: to.id,
                        title: to.name,
                        start: to.startDateTime,
                        end: to.endDateTime,
                        resourceId: `${team}-${to.userId}`,
                        color: 'red',
                    });
                });
            });

            const formattedEvents = [...formattedShifts, ...formattedTimeOff];

            setEvents(formattedEvents);
            setFilteredEvents(filterEvents(formattedEvents, 'company'));
        },
        [filterEvents]
    );

    const getShiftsFromTeams = useCallback(() => {
        setIsLoading(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/shifts`)
            .then((result: AxiosResponse) => {
                formatEvents(result.data.shifts, result.data.timeOff);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [formatEvents]);

    const handleFilterChange = (filterValue: string) => {
        setFilter(filterValue);
        // filtering
        setFilteredEvents(filterEvents(events, filterValue));
    };

    useEffect(() => {
        getShiftsFromTeams();
    }, [getShiftsFromTeams]);

    return (
        <>
            {isLoading ? (
                <>
                    <PageLoading />
                </>
            ) : (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            width: '100%',
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="h1">Calendar</Typography>
                            <DataFilter
                                filterValue={filter}
                                onFilterChange={handleFilterChange}
                                extraOptions={[
                                    {
                                        value: 'personal',
                                        label: 'Personal',
                                        show: user.role === 'staff',
                                    },
                                ]}
                            />
                        </Box>

                        <PermissionCheck permissionLevel={1}>
                            <Tooltip title="Create Event ">
                                <IconButton size="large" onClick={() => {}}>
                                    <AddCircleIcon color="primary" fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        </PermissionCheck>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <FullCalendar
                            timeZone="UTC"
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'timeGridDay,timeGridWeek,dayGridMonth',
                            }}
                            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                            eventDrop={(e) => console.log(e)}
                            height="100%"
                            events={filteredEvents}
                            contentHeight="100%"
                            dayMaxEvents={true}
                            navLinks={true}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default CalendarView;
