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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArchiveIcon from '@mui/icons-material/Archive';

import PageLoading from 'components/loading/PageLoading';
import FormDialog from 'components/dialogs/FormDialog';
import CreateOvertimeCalloutForm from 'components/forms/CreateOvertimeCalloutForm';
import api from 'utils/api';
import { collection, query, onSnapshot } from 'firebase/firestore';

import db from 'utils/firebase';

import { IOvertime } from 'coverme-shared';

const OvertimeCalloutsView: React.FC = () => {
	const [isLoadingCallouts, setIsLoadingCallouts] = useState<boolean>(false);
	const [callouts, setCallouts] = useState<IOvertime[]>([]);
	const [expanded, setExpanded] = useState<string | false>(false);
	const [openCalloutCreation, setOpenCalloutCreation] = useState<boolean>(false);

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

	const handleArchiveOvertimeCallout = (overtimeCalloutId: string) => {
		api.getGenericData(`overtime-callouts/${overtimeCalloutId}/archive`)
			.then(() => {
				const newCallouts = callouts.filter((callout) => callout.id !== overtimeCalloutId);
				setCallouts(newCallouts);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setIsLoadingCallouts(false);
			});
	};

	// const handleCycleCallout = () => {
	// 	setIsLoadingCycle(true);
	// 	api.get(`overtime-callouts/test`)
	// 		.then(() => {
	// 			setTimeout(() => {
	// 				getCalloutsForCompany();
	// 			}, 1000);
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 		})
	// 		.finally(() => {
	// 			setIsLoadingCycle(false);
	// 		});
	// };
	const getCalloutsForCompany = useCallback(() => {
		api.getGenericData(`overtime-callouts`)
			.then((overtimeCallouts) => {
				setCallouts(overtimeCallouts);
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

		const q = query(collection(db, 'overtime-callouts'));

		// Update callouts when they get updated
		const Unsubscribe = onSnapshot(q, (snapshot) => {
			const retrievedCallouts: IOvertime[] = [];
			snapshot.forEach((doc) => {
				const overtime: IOvertime = {
					id: doc.id,
					...doc.data(),
				} as IOvertime;
				retrievedCallouts.push(overtime);
			});

			const filterCallouts = retrievedCallouts.filter((callout) => !callout.archive);
			setCallouts([...filterCallouts]);
		});

		return () => {
			Unsubscribe();
		};
	}, [getCalloutsForCompany]);

	// need to update this page somehow

	const renderList = (callout: IOvertime, team: 'internal' | 'external') => {
		let filteredList = callout.callouts?.filter((calloutUser) => calloutUser.team === team);

		return filteredList?.map((user) => (
			<ListItem key={user.userId} sx={{ width: '100%' }}>
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
					{/* {isLoadingCycle ? (
						<>
							<CircularProgress />
						</>
					) : (
						<Tooltip title="Cycle Callout">
							<IconButton size="large" onClick={handleCycleCallout}>
								<UpdateIcon color="primary" fontSize="large" />
							</IconButton>
						</Tooltip>
					)} */}
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
								{callout.status === 'Complete' && (
									<Tooltip title="Archive Callout">
										<IconButton
											size="large"
											onClick={() =>
												handleArchiveOvertimeCallout(callout.id!)
											}
										>
											<ArchiveIcon color="primary" fontSize="large" />
										</IconButton>
									</Tooltip>
								)}
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
