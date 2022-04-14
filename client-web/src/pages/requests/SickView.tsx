import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import SickRequestHeadCells from 'models/HeaderCells/SickRequestHeadCells';

import { formatSickDisplay } from 'utils/display-formatter';

import { ISickDisplay, ISickRequest } from 'models/Sick';
import { getAddAction } from 'utils/table-actions-helper';
import LinearLoading from 'components/loading/LineraLoading';
import FormDialog from 'components/dialogs/FormDialog';
import CreateSickRequestForm from 'components/forms/CreateSickRequestForm';
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
            console.log(sickRequest);
            const newSickRequests = [...sickRequests, formatSickDisplay(sickRequest)];
            setSickRequests(newSickRequests);
        }

        handleCloseAddSickRequest();
    };

    useEffect(() => {
        setIsLoadingSickRequest(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/sick-request/${user.email!}`
            )
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
    }, [user.company, user.email]);

    return (
        <Box>
            {isLoadingSickRequest ? (
                <Box>
                    <LinearLoading />
                </Box>
            ) : (
                <EnhancedTable
                    title="Sick Requests"
                    headerCells={SickRequestHeadCells}
                    id="id"
                    data={sickRequests}
                    onSelect={handleSelectSickRequest}
                    selected={selected}
                    unSelectedActions={getAddAction(handleAddSickRequest, 0)}
                    selectedActions={[]}
                />
            )}
            <FormDialog open={openAddSickRequest} onClose={handleCloseAddSickRequest}>
                <CreateSickRequestForm onFinish={handleAddSickRequestSuccessfull} />
            </FormDialog>
        </Box>
    );
};

export default SickView;
