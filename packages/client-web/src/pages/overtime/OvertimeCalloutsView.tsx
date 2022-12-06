import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
    Tooltip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UpdateIcon from '@mui/icons-material/Update';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { IOvertime } from 'coverme-shared';
import PageLoading from 'components/loading/PageLoading';
import FormDialog from 'components/dialogs/FormDialog';
import CreateOvertimeCalloutForm from 'components/forms/CreateOvertimeCalloutForm';
import PermissionCheck from 'components/auth/PermissionCheck';
import axios from 'utils/axios-intance';

const OvertimeCalloutsView: React.FC = () => {
    const [isLoadingCallouts, setIsLoadingCallouts] = useState<boolean>(false);
    const [callouts, setCallouts] = useState<IOvertime[]>([]);
    const [expanded, setExpanded] = useState<string | false>(false);
    const [openCalloutCreation, setOpenCalloutCreation] = useState<boolean>(false);

    const [isLoadingCycle, setIsLoadingCycle] = useState<boolean>(false);

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

    const handleCycleCallout = () => {
        setIsLoadingCycle(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/overtime-callouts/test`)
            .then(() => {
                setTimeout(() => {
                    getCalloutsForCompany();
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingCycle(false);
            });
    };

    const handleAcceptedCallout = (calloutId: string, calloutUser: string) => {
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/overtime-callouts/${calloutId}/accept`, {
                email: calloutUser,
            })
            .then(() => {
                setTimeout(() => {
                    getCalloutsForCompany();
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingCycle(false);
            });
    };

    const handleRejectedCallout = (calloutId: string, calloutUser: string) => {
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/overtime-callouts/${calloutId}/reject`, {
                email: calloutUser,
            })
            .then(() => {
                setTimeout(() => {
                    getCalloutsForCompany();
                }, 1000);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingCycle(false);
            });
    };

    const getCalloutsForCompany = useCallback(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/overtime-callouts`)
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

    useEffect(() => {
        // Get pending callouts
        setIsLoadingCallouts(true);
        getCalloutsForCompany();
    }, [getCalloutsForCompany]);

    // need to update this page somehow

    const renderList = (callout: IOvertime, team: 'internal' | 'external') => {
        let filteredList = callout.callouts?.filter((calloutUser) => calloutUser.team === team);

        return filteredList?.map((user) => (
            <ListItem
                key={user.userId}
                sx={{ width: '100%' }}
                secondaryAction={
                    <PermissionCheck permissionLevel={2}>
                        <Tooltip title="Accept Callout">
                            <IconButton
                                onClick={() => handleAcceptedCallout(callout.id!, user.userId)}
                                edge="end"
                            >
                                <ThumbUpIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Callout">
                            <IconButton
                                onClick={() => handleRejectedCallout(callout.id!, user.userId)}
                                edge="end"
                            >
                                <ThumbDownIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </PermissionCheck>
                }
            >
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <AccountCircleIcon color="secondary" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${user.userName}`} />
                <ListItemText sx={{ width: '50%' }} primary={user.status} />
            </ListItem>
        ));
    };

    return (
        <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h1">Overtime Callouts</Typography>
                <Box>
                    {isLoadingCycle ? (
                        <>
                            <CircularProgress />
                        </>
                    ) : (
                        <Tooltip title="Cycle Callout">
                            <IconButton size="large" onClick={handleCycleCallout}>
                                <UpdateIcon color="primary" fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Start Overtime Callout">
                        <IconButton size="large" onClick={handleOpenCalloutCreation}>
                            <AddCircleIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            {isLoadingCallouts ? (
                <PageLoading />
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
                                    Overtime Callout for {callout.shiftInfo} - {callout.team} -{' '}
                                    {callout.status?.toUpperCase()}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <Typography variant="h4">Staff Notified Within Team</Typography>
                                    <List>{renderList(callout, 'internal')}</List>
                                </Box>
                                <Box>
                                    <Typography variant="h4">
                                        Staff Notified Outside Team
                                    </Typography>
                                    <List>{renderList(callout, 'external')}</List>
                                </Box>
                            </AccordionDetails>
                            <AccordionActions>
                                <Typography variant="h4">
                                    {callout.shiftAcceptedBy && callout.shiftAcceptedBy !== ''
                                        ? `Shift assigned to ${callout.shiftAcceptedBy}`
                                        : ''}
                                </Typography>
                            </AccordionActions>
                        </Accordion>
                    ))}
                </>
            )}
            <FormDialog open={openCalloutCreation} onClose={handleCloseCalloutCreation}>
                <CreateOvertimeCalloutForm onFinish={handleAddCallout} />
            </FormDialog>
        </>
    );
};

export default OvertimeCalloutsView;
