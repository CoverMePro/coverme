import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
    Tooltip,
    IconButton,
} from '@mui/material';
import LinearLoading from 'components/loading/LineraLoading';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormDialog from 'components/dialogs/FormDialog';
import CreateOvertimeCalloutForm from 'components/forms/CreateOvertimeCalloutForm';

import axios from 'utils/axios-intance';
import { IOvertime } from 'models/Overtime';
import { formatDateString } from 'utils/date-formatter';

const OvertimeCallouts: React.FC = () => {
    const [isLoadingCallouts, setIsLoadingCallouts] = useState<boolean>(false);
    const [callouts, setCallouts] = useState<IOvertime[]>([]);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [openCalloutCreation, setOpenCalloutCreation] = useState<boolean>(false);

    const user = useTypedSelector((state) => state.user);

    const handleCalloutChange =
        (calloutId: any) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? calloutId : false);
        };

    const handleOpenCalloutCreation = () => {
        setOpenCalloutCreation(true);
    };

    const handleCloseCalloutCreation = () => {
        setOpenCalloutCreation(false);
    };

    const handleAddCallout = (callout: IOvertime | undefined) => {
        // Add callout to database;
        if (callout) {
            const newCallouts = [...callouts, callout];
            setCallouts(newCallouts);
        }

        setOpenCalloutCreation(false);
    };

    useEffect(() => {
        // Get pending callouts
        setIsLoadingCallouts(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/overtime-callout/${user.company!}`)
            .then((results) => {
                setCallouts(results.data.overtimeCallouts);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingCallouts(false);
            });
    }, []);

    // need to update this page somehow

    return (
        <Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Overtime Callouts</Typography>
                <Tooltip title="Start Overtime Callout">
                    <IconButton size="large" onClick={handleOpenCalloutCreation}>
                        <AddCircleIcon color="primary" fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Box>
            {isLoadingCallouts ? (
                <>
                    <LinearLoading />
                </>
            ) : (
                <>
                    {callouts.map((callout) => (
                        <Accordion
                            key={callout.id}
                            expanded={expanded === callout.id}
                            onChange={handleCalloutChange(callout.id)}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h3">
                                    Overtime Callout for {callout.shiftInfo} - {callout.team}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="h4">Staff Notified Within Team</Typography>
                                <Typography variant="h4">Staff Notified Outside Team</Typography>
                            </AccordionDetails>
                            <AccordionActions>
                                <Typography variant="h4">Status - {callout.status}</Typography>
                            </AccordionActions>
                        </Accordion>
                    ))}
                </>
            )}
            <FormDialog open={openCalloutCreation} onClose={handleCloseCalloutCreation}>
                <CreateOvertimeCalloutForm onFinish={handleAddCallout} />
            </FormDialog>
        </Box>
    );
};

export default OvertimeCallouts;
