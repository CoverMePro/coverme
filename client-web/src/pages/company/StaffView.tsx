import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

import { Box } from '@mui/material';

import StaffHeaderCells from 'models/HeaderCells/StaffHeadCells';
import { IUser } from 'models/User';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import RegisterUserForm from 'components/forms/RegisterUserForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import FormDialog from 'components/dialogs/FormDialog';
import LinearLoading from 'components/loading/LineraLoading';

import { getAddAction, getDeleteAction } from 'utils/react/table-actions-helper';
import { formatDateString } from 'utils/formatters/dateTime-formatter';
import axios from 'utils/axios-intance';

const StaffView: React.FC = () => {
    const [openAddStaff, setOpenAddStaff] = useState<boolean>(false);
    const [openDeleteStaff, setOpenDeleteStaff] = useState<boolean>(false);
    const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
    const [isLoadingDeleteStaff, setIsLoadingDeleteStaff] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [staff, setStaff] = useState<IUser[]>([]);

    const { enqueueSnackbar } = useSnackbar();

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

    const getSelectedStaffName = (selectedStaffId: any) => {
        return staff.find((user) => user.id === selectedStaffId);
    };

    const handleOpenDeleteStaff = (selectedStaff: any) => {
        const user = getSelectedStaffName(selectedStaff);
        setDeleteMessage(`Are you sure you want to delete ${user?.firstName} ${user?.lastName}?`);
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

    const formatHireDate = (staff: IUser[]) => {
        return staff.map((user) => {
            const date = user.hireDate;
            user.hireDate = formatDateString(date! as Date);
            return user;
        });
    };

    const handleGetUsers = useCallback(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/users`)
            .then((result) => {
                setStaff(formatHireDate(result.data.users));
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoadingStaff(false));
    }, []);

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
                        id="id"
                        selected={selected}
                        onSelect={handleSelectStaff}
                        unSelectedActions={getAddAction('Staff', handleAddStaff)}
                        selectedActions={getDeleteAction('Staff', handleOpenDeleteStaff)}
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
