import React, { useState, useEffect } from 'react';

import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Typography } from '@mui/material';

import { staffSickHeadCells } from 'models/HeaderCells/SickRequestHeadCells';
import { ISickDisplay, ISickRequest } from 'models/Sick';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import PageLoading from 'components/loading/PageLoading';
import FormDialog from 'components/dialogs/FormDialog';
import CreateSickRequestForm from 'components/forms/CreateSickRequestForm';

import { getAddAction } from 'utils/react/table-actions-helper';
import { formatSickDisplay } from 'utils/formatters/display-formatter';
import axios from 'utils/axios-intance';

const SickView: React.FC = () => {
    const [openAddSickRequest, setOpenAddSickRequest] = useState<boolean>(false);
    const [isLoadingSickRequest, setIsLoadingSickRequest] = useState<boolean>(false);
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [sickRequests, setSickRequests] = useState<ISickDisplay[]>([]);

    const user = useTypedSelector((state) => state.user);

    const handleSelectSickRequest = (sickRequest: any | undefined) => {
        if (selected === sickRequest) {
            setSelected(undefined);
        } else {
            setSelected(sickRequest);
        }
    };

    const handleAddSickRequest = () => {
        setOpenAddSickRequest(true);
    };

    const handleCloseAddSickRequest = () => {
        setOpenAddSickRequest(false);
    };

    const handleAddSickRequestSuccessfull = (sickRequest: ISickRequest | undefined) => {
        if (sickRequest) {
            const newSickRequests = [...sickRequests, formatSickDisplay(sickRequest)];
            setSickRequests(newSickRequests);
        }

        handleCloseAddSickRequest();
    };

    useEffect(() => {
        setIsLoadingSickRequest(true);

        if (user.role === 'staff') {
            axios
                .get(`${process.env.REACT_APP_SERVER_API}/sick-requests/${user.id!}`)
                .then((result) => {
                    const sickRequests: ISickRequest[] = result.data.sickRequests;
                    const sickDisplay: ISickDisplay[] = [];

                    sickRequests.forEach((sickRequest) => {
                        sickDisplay.push(formatSickDisplay(sickRequest));
                    });

                    setSickRequests([...sickDisplay]);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoadingSickRequest(false));
        } else {
            axios
                .post(`${process.env.REACT_APP_SERVER_API}/sick-requests/from-teams`, {
                    teams: user.teams,
                })
                .then((result) => {
                    const sickRequests: ISickRequest[] = result.data.sickRequests;
                    const sickDisplay: ISickDisplay[] = [];

                    sickRequests.forEach((sickRequest) => {
                        sickDisplay.push(formatSickDisplay(sickRequest));
                    });

                    setSickRequests([...sickDisplay]);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoadingSickRequest(false));
        }
    }, [user]);

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h1">Sick Requests</Typography>
            </Box>
            {isLoadingSickRequest ? (
                <PageLoading />
            ) : (
                <EnhancedTable
                    headerCells={staffSickHeadCells}
                    id="id"
                    data={sickRequests}
                    onSelect={handleSelectSickRequest}
                    selected={selected}
                    unSelectedActions={getAddAction('Request', handleAddSickRequest, 0)}
                    selectedActions={[]}
                />
            )}
            <FormDialog open={openAddSickRequest} onClose={handleCloseAddSickRequest}>
                <CreateSickRequestForm onFinish={handleAddSickRequestSuccessfull} />
            </FormDialog>
        </>
    );
};

export default SickView;
