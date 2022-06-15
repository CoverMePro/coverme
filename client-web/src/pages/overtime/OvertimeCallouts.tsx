import React, { useState, useEffect, useCallback } from "react";
import { useTypedSelector } from "hooks/use-typed-selector";

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
} from "@mui/material";
import LinearLoading from "components/loading/LineraLoading";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UpdateIcon from "@mui/icons-material/Update";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import FormDialog from "components/dialogs/FormDialog";
import CreateOvertimeCalloutForm from "components/forms/CreateOvertimeCalloutForm";

import axios from "utils/axios-intance";
import { ICallout, IOvertime } from "models/Overtime";
import PermissionCheck from "components/auth/PermissionCheck";

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

    const handleCycleCallout = () => {
        axios.get(`${process.env.REACT_APP_SERVER_API}/overtime-callout/test`).then(() => {});
    };

    const getCalloutsForCompany = useCallback(() => {
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
    }, [user.company]);

    useEffect(() => {
        // Get pending callouts
        getCalloutsForCompany();
    }, [getCalloutsForCompany]);

    // need to update this page somehow

    const renderList = (callout: IOvertime, isInternal: boolean) => {
        let filteredList = isInternal
            ? callout.callouts?.filter((calloutUser) => calloutUser.team === callout.team)
            : callout.callouts?.filter((calloutUser) => calloutUser.team !== callout.team);

        return filteredList?.map((user) => (
            <ListItem
                key={user.user}
                sx={{ width: "100%" }}
                secondaryAction={
                    <PermissionCheck permissionLevel={2}>
                        <Tooltip title="Accept Callout">
                            <IconButton onClick={() => {}} edge="end">
                                <ThumbUpIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Callout">
                            <IconButton onClick={() => {}} edge="end">
                                <ThumbDownIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </PermissionCheck>
                }
            >
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                        <AccountCircleIcon color="secondary" />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${user.user}`} />
                <ListItemText sx={{ width: "50%" }} primary={user.status} />
            </ListItem>
        ));
    };

    return (
        <Box>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h2">Overtime Callouts</Typography>
                <Box>
                    <Tooltip title="Cycle Callout">
                        <IconButton size="large" onClick={handleCycleCallout}>
                            <UpdateIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Start Overtime Callout">
                        <IconButton size="large" onClick={handleOpenCalloutCreation}>
                            <AddCircleIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
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
                                <Box>
                                    <Typography variant="h4">Staff Notified Within Team</Typography>
                                    <List>{renderList(callout, true)}</List>
                                </Box>
                                <Box>
                                    <Typography variant="h4">
                                        Staff Notified Outside Team
                                    </Typography>
                                    <List>{renderList(callout, false)}</List>
                                </Box>
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
