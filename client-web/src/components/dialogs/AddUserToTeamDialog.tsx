import React, { useState } from 'react';

import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    TextField,
    CircularProgress,
    Button,
} from '@mui/material';
import { IUser } from 'models/User';

import axios from 'utils/axios-intance';

interface IAddUserDialogProps {
    open: boolean;
    teamName: string;
    usersToAdd: IUser[];
    onAddComplete: (user: IUser) => void;
    onDialogClose: () => void;
}

const AddUserToTeamDialog: React.FC<IAddUserDialogProps> = ({
    open,
    teamName,
    usersToAdd,
    onAddComplete,
    onDialogClose,
}) => {
    const [userSelectedToAdd, setUserSelectedToAdd] = useState<IUser | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();
    const user = useTypedSelector((state) => state.user);

    const handleSelectUserToAdd = (selectUser: IUser | null) => {
        if (selectUser) {
            setUserSelectedToAdd(selectUser);
        } else {
            setUserSelectedToAdd(undefined);
        }
    };

    const handleAddUserToTeam = () => {
        setIsLoading(true);
        if (userSelectedToAdd) {
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/teams/${teamName}/add-user`, {
                    user: userSelectedToAdd,
                })
                .then(() => {
                    enqueueSnackbar(`User added to ${teamName}`, { variant: 'success' });

                    onAddComplete(userSelectedToAdd);
                })
                .catch((err) => {
                    enqueueSnackbar('An error occured, please try again!', {
                        variant: 'error',
                    });
                    console.log(err);

                    onDialogClose();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <Dialog open={open} onClose={onDialogClose}>
            <DialogTitle>Add User to {teamName}</DialogTitle>
            <DialogContent>
                <Autocomplete
                    sx={{ mt: 2 }}
                    disablePortal
                    options={usersToAdd}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    onChange={(e, val) => {
                        handleSelectUserToAdd(val);
                    }}
                    renderInput={(params: any) => (
                        <TextField {...params} variant="outlined" label="User" />
                    )}
                />
                <DialogActions sx={{ mt: 2 }}>
                    {isLoading ? (
                        <CircularProgress sx={{ mb: 1, mr: 1 }} size={25} />
                    ) : (
                        <>
                            <Button color="error" onClick={onDialogClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddUserToTeam}>Add</Button>
                        </>
                    )}
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserToTeamDialog;
