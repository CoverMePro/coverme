import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction';

import { Box } from '@mui/material';

const ScheduleView: React.FC = () => {
    console.log(new Date().toISOString());

    useEffect(() => {
        const containerEl = document.getElementById('external-events');
        let drag: Draggable;
        if (containerEl) {
            drag = new Draggable(containerEl, {
                itemSelector: '.fc-event',
                eventData: function (eventEl) {
                    return {
                        title: eventEl.innerText,
                    };
                },
            });
        }
        return () => {
            drag.destroy();
        };
    }, []);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <p>
                    <strong>Shifts</strong>
                </p>
                <div id="external-events" style={{ display: 'flex', gap: '10px' }}>
                    <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                        <div className="fc-event-main">My Event 1</div>
                    </div>
                    <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                        <div className="fc-event-main">My Event 2</div>
                    </div>
                    <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                        <div className="fc-event-main">My Event 3</div>
                    </div>
                    <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                        <div className="fc-event-main">My Event 4</div>
                    </div>
                    <div className="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event">
                        <div className="fc-event-main">My Event 5</div>
                    </div>
                </div>
            </Box>
            <div>
                <FullCalendar
                    timeZone="local"
                    plugins={[resourceTimelinePlugin, resourceTimegridPlugin, interactionPlugin]}
                    schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                    initialView="resourceTimelineDay"
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
                    }}
                    resourceAreaHeaderContent="Staff"
                    resources={[
                        { id: '1', title: 'test' },
                        { id: '2', title: 'test2' },
                    ]}
                    editable={true}
                    eventStartEditable={true}
                    eventResizableFromStart={true}
                    eventDurationEditable={true}
                    eventResourceEditable={true}
                    droppable={true}
                    events={[]}
                    drop={(info: DropArg) => {
                        console.log(info);
                    }}
                    height={'auto'}
                    contentHeight={'auto'}
                />
            </div>
        </Box>
    );
};

export default ScheduleView;
