import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, CircularProgress } from '@mui/material';

import ShiftHeaderCells from 'models/HeaderCells/ShiftHeadCells';
import { IUser } from 'models/User';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import RegisterUserForm from 'components/forms/RegisterUserForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';

import axios from 'utils/axios-intance';
import FormDialog from 'components/dialogs/FormDialog';
import CreateShiftForm from 'components/forms/CreateShiftForm';

const ShiftsView: React.FC = () => {
    const [openAddShift, setOpenAddShift] = useState<boolean>(false);
    const [openDeleteShift, setOpenDeleteShift] = useState<boolean>(false);
    const [isLoadingShift, setIsLoadingShift] = useState<boolean>(false);
    const [isLoadingDeleteShift, setIsLoadingDeleteShift] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [shift, setShift] = useState<IUser[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const user = useTypedSelector((state) => state.user);

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
        setDeleteMessage(`Are you sure you want to delete ${selectedShift}?`);
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
            .get(`${process.env.REACT_APP_SERVER_API}/auth/delete/${selected}`)
            .then(() => {
                enqueueSnackbar('User successfully deleted', { variant: 'success' });
                setSelected(undefined);
                //handleGetUsers();
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

    // const handleGetUsers = useCallback(() => {
    //     axios
    //         .get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
    //         .then((result) => {
    //             setShift(result.data.users);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }, [user.company]);

    // useEffect(() => {
    //     const loadUsers = async () => {
    //         setIsLoadingShift(true);
    //         await handleGetUsers();
    //         setIsLoadingShift(false);
    //     };

    //     loadUsers();
    // }, [handleGetUsers]);

    return (
        <>
            {isLoadingShift ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Box>
                    <EnhancedTable
                        title="shift List"
                        data={shift}
                        headerCells={ShiftHeaderCells}
                        id="email"
                        selected={selected}
                        onSelect={handleSelectShift}
                        onAdd={handleAddShift}
                        onDelete={handleOpenDeleteShift}
                    />
                    <FormDialog open={openAddShift} onClose={handleCloseAddShift}>
                        <CreateShiftForm />
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
