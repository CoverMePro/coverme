import React from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimegridPlugin from '@fullcalendar/resource-timegrid'; // a plugin

import { Box } from '@mui/material';

const ScheduleView: React.FC = () => {
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <FullCalendar
                plugins={[resourceTimelinePlugin, resourceTimegridPlugin]}
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
                height={'auto'}
                contentHeight={'auto'}
            />
        </Box>
    );
};

export default ScheduleView;
