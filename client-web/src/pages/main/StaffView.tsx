import React, { useState, useEffect, useCallback } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Dialog, CircularProgress } from '@mui/material';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import StaffHeaderCells from 'models/HeaderCells/StaffHeadCells';
import { IUserInfo } from 'models/User';
import RegisterUserForm from 'components/forms/user/RegisterUserForm';
import DeleteConfirmation from 'components/confirmation/DeleteConfirmation';

import axios from 'utils/axios-intance';

const StaffView: React.FC = () => {
  const [openAddStaff, setOpenAddStaff] = useState<boolean>(false);
  const [openDeleteStaff, setOpenDeleteStaff] = useState<boolean>(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(true);
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [selectedForDelete, setSelectedForDelete] = useState<any>([]);
  const [staff, setStaff] = useState<IUserInfo[]>([]);

  const user = useTypedSelector((state) => state.user);

  const handleAddStaff = () => {
    setOpenAddStaff(true);
  };

  const handleOpenDeleteStaff = (selectedStaff: any) => {
    setSelectedForDelete(selectedStaff);
    setDeleteMessage(`Are you sure you want to delete ${selectedStaff}?`);
    setOpenDeleteStaff(true);
  };

  const handleCloseAddStaff = () => {
    setOpenAddStaff(false);
    handleGetUsers();
  };

  const handleCloseDeleteStaff = () => {
    setOpenDeleteStaff(false);
  };

  const handleConfirmDeleteStaff = () => {
    setOpenDeleteStaff(false);
  };

  const handleGetUsers = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
      .then((result) => {
        setStaff(result.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.company]);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingStaff(true);
      await handleGetUsers();
      setIsLoadingStaff(false);
    };

    loadUsers();
  }, [handleGetUsers]);

  return (
    <>
      {isLoadingStaff ? (
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
            title="Staff List"
            data={staff}
            headerCells={StaffHeaderCells}
            id="email"
            onAdd={handleAddStaff}
            onDelete={handleOpenDeleteStaff}
          />
          <Dialog open={openAddStaff} onClose={handleCloseAddStaff}>
            <RegisterUserForm onFinish={handleCloseAddStaff} />
          </Dialog>
          <DeleteConfirmation
            open={openDeleteStaff}
            message={deleteMessage}
            onClose={handleCloseDeleteStaff}
            onConfirm={handleConfirmDeleteStaff}
          />
        </Box>
      )}
    </>
  );
};

export default StaffView;
