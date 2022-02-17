import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, LinearProgress } from '@mui/material';

import ShiftHeaderCells from 'models/HeaderCells/ShiftHeadCells';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';

import axios from 'utils/axios-intance';
import FormDialog from 'components/dialogs/FormDialog';
import CreateShiftForm from 'components/forms/CreateShiftForm';
import { IShiftDefinition } from 'models/ShiftDefinition';

const ShiftsView: React.FC = () => {
    const [openAddShift, setOpenAddShift] = useState<boolean>(false);
    const [openDeleteShift, setOpenDeleteShift] = useState<boolean>(false);
    const [isLoadingShift, setIsLoadingShift] = useState<boolean>(false);
    const [isLoadingDeleteShift, setIsLoadingDeleteShift] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [shiftDefs, setShiftDefs] = useState<IShiftDefinition[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const user = useTypedSelector((state) => state.user);

    const getShiftName = (id: string) => {
        const shiftFound = shiftDefs.find((shiftDef) => shiftDef.id === id);

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
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/shift-definition/${selected}/delete`
            )
            .then(() => {
                enqueueSnackbar('User successfully deleted', { variant: 'success' });
                const newShiftDefs = shiftDefs.filter((shiftDef) => shiftDef.id !== selected);
                setShiftDefs(newShiftDefs);
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

    const handleConfirmAdd = (shiftDef: IShiftDefinition) => {
        handleCloseAddShift();

        const newShiftDefs = [...shiftDefs, shiftDef];
        setShiftDefs(newShiftDefs);
    };

    useEffect(() => {
        setIsLoadingShift(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/${user.company!}/shift-definition`)
            .then((result) => {
                setShiftDefs(result.data.shiftDefs);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoadingShift(false));
    }, [user.company]);

    return (
        <>
            {isLoadingShift ? (
                <>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            my: '5px',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            my: '5px',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            my: '5px',
                        }}
                    >
                        <LinearProgress />
                    </Box>
                </>
            ) : (
                <Box>
                    <EnhancedTable
                        title="Shifts"
                        data={shiftDefs}
                        headerCells={ShiftHeaderCells}
                        id="id"
                        selected={selected}
                        onSelect={handleSelectShift}
                        onAdd={handleAddShift}
                        onDelete={handleOpenDeleteShift}
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
