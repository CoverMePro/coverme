import React, { useEffect, useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction';

import { Box, LinearProgress } from '@mui/material';

import axios from 'utils/axios-intance';
import { AxiosResponse } from 'axios';

const getDuration = (shift: string) => {
    const shiftDuration: any = {
        'Full Shift': '08:00',
        'Half Shift': '04:00',
    };

    return shiftDuration[shift] ?? '08:00';
};

const ScheduleView: React.FC = () => {
    const [teamStaff, setTeamStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = useTypedSelector((state) => state.user);

    const handleDragStop = (e: any) => {
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
        }
    };

    useEffect(() => {
        let drag: Draggable;
        setIsLoading(true);
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/shift/from-teams`, {
                teams: user.teams ? user.teams : [],
            })
            .then((result: AxiosResponse) => {
                console.log(result.data);
                setTeamStaff(result.data.teamStaff);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
                const containerEl = document.getElementById('external-events');

                if (containerEl) {
                    drag = new Draggable(containerEl, {
                        itemSelector: '.fc-event',
                        eventData: function (eventEl: any) {
                            return {
                                title: 'Shift',
                                duration: getDuration(eventEl.innerText),
                            };
                        },
                    });
                }
            });

        return () => {
            drag.destroy();
        };
    }, []);

    const generateGroupResource = () => {
        Object.keys(teamStaff).map((key) => {});
    };

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
                    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <p>
                            <strong>Shifts</strong>
                        </p>
                        <div id="external-events" style={{ display: 'flex', gap: '10px' }}>
                            <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                                <div className="fc-event-main">Full Shift</div>
                            </div>
                            <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                                <div className="fc-event-main">Half Shift</div>
                            </div>
                        </div>

                        <div id="fc-trash">TRASH</div>
                    </Box>
                    <div>
                        <FullCalendar
                            timeZone="local"
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
                            droppable={true}
                            events={[]}
                            drop={(info: DropArg) => {
                                console.log(info);
                            }}
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
