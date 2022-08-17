import React, { useState, useEffect } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';

import { Box, Typography } from '@mui/material';

import ShiftHeaderCells from 'models/HeaderCells/ShiftHeadCells';
import { IShiftTemplate } from 'models/ShiftTemplate';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import CreateShiftForm from 'components/forms/CreateShiftForm';
import PageLoading from 'components/loading/PageLoading';

import { getAddAction, getDeleteAction } from 'utils/react/table-actions-helper';
import axios from 'utils/axios-intance';

const ShiftsView: React.FC = () => {
    const [openAddShift, setOpenAddShift] = useState<boolean>(false);
    const [openDeleteShift, setOpenDeleteShift] = useState<boolean>(false);
    const [isLoadingShift, setIsLoadingShift] = useState<boolean>(false);
    const [isLoadingDeleteShift, setIsLoadingDeleteShift] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [shiftTemplates, setShiftTemplates] = useState<IShiftTemplate[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const user = useTypedSelector((state) => state.user);

    // TO DO: REFACTOR OUTSIDE COMP
    const getShiftName = (id: string) => {
        const shiftFound = shiftTemplates.find((shiftTemplate) => shiftTemplate.id === id);

        if (shiftFound) {
            return shiftFound.name;
        } else {
            return id;
        }
    };

    const handleSelectShift = (shift: any | undefined) => {
        if (selected === shift) {
            setSelected(undefined);
        } else {
            setSelected(shift);
        }
    };

    const handleAddShift = () => {
        setOpenAddShift(true);
    };

    const handleOpenDeleteShift = (selectedShift: any) => {
        setDeleteMessage(`Are you sure you want to delete ${getShiftName(selectedShift)}?`);
        setOpenDeleteShift(true);
    };

    const handleCloseAddShift = () => {
        setOpenAddShift(false);
    };

    const handleCloseDeleteShift = () => {
        setOpenDeleteShift(false);
    };

    const handleConfirmDeleteShift = () => {
        setIsLoadingDeleteShift(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/shift-templates/${selected}/delete`)
            .then(() => {
                enqueueSnackbar('User successfully deleted', { variant: 'success' });
                const newShiftDefs = shiftTemplates.filter(
                    (shiftTemplate) => shiftTemplate.id !== selected
                );
                setShiftTemplates(newShiftDefs);
                setSelected(undefined);
            })
            .catch((err) => {
                enqueueSnackbar('Error trying to delete user, please try again', {
                    variant: 'error',
                });
            })
            .finally(() => {
                setOpenDeleteShift(false);
                setIsLoadingDeleteShift(false);
            });
    };

    const handleConfirmAdd = (shiftTemplate: IShiftTemplate) => {
        handleCloseAddShift();

        const newShiftDefs = [...shiftTemplates, shiftTemplate];
        setShiftTemplates(newShiftDefs);
    };

    useEffect(() => {
        setIsLoadingShift(true);
        axios
            .get<IShiftTemplate[]>(`${process.env.REACT_APP_SERVER_API}/shift-templates`)
            .then((result) => {
                setShiftTemplates(result.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoadingShift(false));
    }, [user.company]);

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h1">Shfits</Typography>
            </Box>
            {isLoadingShift ? (
                <PageLoading />
            ) : (
                <Box>
                    <EnhancedTable
                        data={shiftTemplates}
                        headerCells={ShiftHeaderCells}
                        id="id"
                        selected={selected}
                        onSelect={handleSelectShift}
                        unSelectedActions={getAddAction('Shift', handleAddShift)}
                        selectedActions={getDeleteAction('Shift', handleOpenDeleteShift)}
                    />
                    <FormDialog open={openAddShift} onClose={handleCloseAddShift}>
                        <CreateShiftForm onAddComplete={handleConfirmAdd} />
                    </FormDialog>
                    <DeleteConfirmation
                        open={openDeleteShift}
                        message={deleteMessage}
                        isLoading={isLoadingDeleteShift}
                        onClose={handleCloseDeleteShift}
                        onConfirm={handleConfirmDeleteShift}
                    />
                </Box>
            )}
        </>
    );
};

export default ShiftsView;
