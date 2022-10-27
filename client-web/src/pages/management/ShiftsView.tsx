import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { IShiftTemplate, IShiftTemplateDisplay } from 'models/ShiftTemplate';
import PageLoading from 'components/loading/PageLoading';
import axios from 'utils/axios-intance';
import TabPanel from 'components/tabs/TabPanel';
import DefineShift from 'components/shifts/DefineShift';
import WeeklyRotation from 'components/shifts/WeeklyRotation';
import { IShiftRotation } from 'models/ShiftRotation';
import { formatShiftTemplateDisplay } from 'utils/formatters/display-formatter';

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
        setShiftTemplates(newShiftDefs);
    };

    const handleConfirmDeleteShiftRotation = (newShiftRotations: IShiftRotation[]) => {
        setShiftRotations([...newShiftRotations]);
    };

    const handleConfirmAddShiftRotation = (shiftRotation: IShiftRotation) => {
        console.log(shiftRotation);

        const newShiftRotations = [...shiftRotations, shiftRotation];

        console.log(newShiftRotations);
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

                const getShiftTemplatePromise = axios.get<IShiftTemplate[]>(
                    `${process.env.REACT_APP_SERVER_API}/shift-templates`
                );
                const getShiftRotationsPromise = axios.get<IShiftRotation[]>(
                    `${process.env.REACT_APP_SERVER_API}/shift-rotations`
                );

                const [templateResults, rotationsResults] = await Promise.all([
                    getShiftTemplatePromise,
                    getShiftRotationsPromise,
                ]);

                setShifts(templateResults.data);
                setShiftTemplates(formatShiftTemplatesToDisplay(templateResults.data));
                setShiftRotations(rotationsResults.data);
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
                                shiftTemplates={shiftTemplates}
                                onAdd={handleConfirmAddShiftTemplate}
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
