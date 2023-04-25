import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';

import PageLoading from 'components/loading/PageLoading';
import TabPanel from 'components/tabs/TabPanel';
import DefineShift from 'components/shifts/DefineShift';
import WeeklyRotation from 'components/shifts/WeeklyRotation';
import { formatShiftTemplateDisplay } from 'utils/formatters/display-formatter';
import api from 'utils/api';

import { IShiftTemplate, IShiftTemplateDisplay, IShiftRotation } from 'coverme-shared';

const ShiftsView: React.FC = () => {
	const [isLoadingShift, setIsLoadingShift] = useState<boolean>(false);
	const [shifts, setShifts] = useState<IShiftTemplate[]>([]);
	const [shiftTemplates, setShiftTemplates] = useState<IShiftTemplateDisplay[]>([]);
	const [shiftRotations, setShiftRotations] = useState<IShiftRotation[]>([]);

	const [tabValue, setTabValue] = useState<number>(0);

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleConfirmDeleteShiftTemplate = (newShiftTemplates: IShiftTemplateDisplay[]) => {
		setShiftTemplates([...newShiftTemplates]);
	};

	const handleConfirmAddShiftTemplate = (shiftTemplate: IShiftTemplate) => {
		const newShiftDefs = [...shiftTemplates, formatShiftTemplateDisplay(shiftTemplate)];
		const newShifts = [...shifts, shiftTemplate];
		setShifts(newShifts);
		setShiftTemplates(newShiftDefs);
	};

	const handleConfirmEditShiftTemplate = (shiftTemplate: IShiftTemplate) => {
		const newShifts = [...shifts];
		const updatedShiftIndex = newShifts.findIndex((shift) => shift.id === shiftTemplate.id);
		newShifts[updatedShiftIndex] = { ...shiftTemplate };
		setShifts(newShifts);
		setShiftTemplates(formatShiftTemplatesToDisplay(newShifts));
	};

	const handleConfirmDeleteShiftRotation = (newShiftRotations: IShiftRotation[]) => {
		setShiftRotations([...newShiftRotations]);
	};

	const handleConfirmAddShiftRotation = (shiftRotation: IShiftRotation) => {
		const newShiftRotations = [...shiftRotations, shiftRotation];
		setShiftRotations(newShiftRotations);
	};

	const formatShiftTemplatesToDisplay = (shiftTemplates: IShiftTemplate[]) => {
		const shiftDisplays = shiftTemplates.map((template) =>
			formatShiftTemplateDisplay(template)
		);

		return shiftDisplays;
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoadingShift(true);

				const getShiftTemplatePromise = api.getAllData<IShiftTemplate>(`shift-templates`);
				const getShiftRotationsPromise = api.getAllData<IShiftRotation>(`shift-rotations`);

				const [templateResults, rotationsResults] = await Promise.all([
					getShiftTemplatePromise,
					getShiftRotationsPromise,
				]);

				setShifts(templateResults);
				setShiftTemplates(formatShiftTemplatesToDisplay(templateResults));
				setShiftRotations(rotationsResults);
				setIsLoadingShift(false);
			} catch (err) {
				console.error(err);
				setIsLoadingShift(false);
			}
		};

		loadData();
	}, []);

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<Typography variant="h1">Shifts</Typography>
			</Box>
			{isLoadingShift ? (
				<PageLoading />
			) : (
				<Box>
					<Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
						<Tab label="Single Shift Templates" />
						<Tab label="Week Rotations" />
					</Tabs>
					<Box>
						<TabPanel index={0} value={tabValue}>
							<DefineShift
								shifts={shifts}
								shiftTemplates={shiftTemplates}
								onAdd={handleConfirmAddShiftTemplate}
								onEdit={handleConfirmEditShiftTemplate}
								onDelete={handleConfirmDeleteShiftTemplate}
							/>
						</TabPanel>
						<TabPanel index={1} value={tabValue}>
							<WeeklyRotation
								rotations={shiftRotations}
								shifts={shifts}
								onAddComplete={handleConfirmAddShiftRotation}
								onDeleteComplet={handleConfirmDeleteShiftRotation}
							/>
						</TabPanel>
					</Box>
				</Box>
			)}
		</>
	);
};

export default ShiftsView;
