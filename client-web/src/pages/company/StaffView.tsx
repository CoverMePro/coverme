import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box } from '@mui/material';

import StaffHeaderCells from 'models/HeaderCells/StaffHeadCells';
import { IUser } from 'models/User';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import RegisterUserForm from 'components/forms/RegisterUserForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import LinearLoading from 'components/loading/LineraLoading';

import axios from 'utils/axios-intance';
import { getAddAction, getDeleteAction } from 'utils/table-actions-helper';

const StaffView: React.FC = () => {
    const [openAddStaff, setOpenAddStaff] = useState<boolean>(false);
    const [openDeleteStaff, setOpenDeleteStaff] = useState<boolean>(false);
    const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
    const [isLoadingDeleteStaff, setIsLoadingDeleteStaff] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [staff, setStaff] = useState<IUser[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const user = useTypedSelector((state) => state.user);

    const handleSelectStaff = (staff: any | undefined) => {
        if (selected === staff) {
            setSelected(undefined);
        } else {
            setSelected(staff);
        }
    };

    const handleAddStaff = () => {
        setOpenAddStaff(true);
    };

    const handleOpenDeleteStaff = (selectedStaff: any) => {
        setDeleteMessage(`Are you sure you want to delete ${selectedStaff}?`);
        setOpenDeleteStaff(true);
    };

    const handleCloseAddStaff = () => {
        setOpenAddStaff(false);
    };

    const handleCloseDeleteStaff = () => {
        setOpenDeleteStaff(false);
    };

    const handleConfirmDeleteStaff = () => {
        setIsLoadingDeleteStaff(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/auth/delete/${selected}`)
            .then(() => {
                enqueueSnackbar('User successfully deleted', { variant: 'success' });
                setSelected(undefined);
                handleGetUsers();
            })
            .catch((err) => {
                enqueueSnackbar('Error trying to delete user, please try again', {
                    variant: 'error',
                });
            })
            .finally(() => {
                setOpenDeleteStaff(false);
                setIsLoadingDeleteStaff(false);
            });
    };

    const handleGetUsers = useCallback(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
            .then((result) => {
                setStaff(result.data.users);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoadingStaff(false));
    }, [user.company]);

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoadingStaff(true);
            await handleGetUsers();
        };

        loadUsers();
    }, [handleGetUsers]);

    return (
        <>
            {isLoadingStaff ? (
                <LinearLoading />
            ) : (
                <Box>
                    <EnhancedTable
                        title="Staff List"
                        data={staff}
                        headerCells={StaffHeaderCells}
                        id="email"
                        selected={selected}
                        onSelect={handleSelectStaff}
                        unSelectedActions={getAddAction(handleAddStaff)}
                        selectedActions={getDeleteAction(handleOpenDeleteStaff)}
                    />
                    <FormDialog open={openAddStaff} onClose={handleCloseAddStaff}>
                        <RegisterUserForm
                            onFinish={() => {
                                handleCloseAddStaff();
                                handleGetUsers();
                            }}
                        />
                    </FormDialog>
                    <DeleteConfirmation
                        open={openDeleteStaff}
                        message={deleteMessage}
                        isLoading={isLoadingDeleteStaff}
                        onClose={handleCloseDeleteStaff}
                        onConfirm={handleConfirmDeleteStaff}
                    />
                </Box>
            )}
        </>
    );
};

export default StaffView;
