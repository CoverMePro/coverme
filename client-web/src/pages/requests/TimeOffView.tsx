import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { Box } from '@mui/material';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import TimeOffHeadCells from 'models/HeaderCells/TimeOffHeadCells';

import { formatTimeOffDisplay } from 'utils/display-formatter';

import { getAddAction } from 'utils/table-actions-helper';
import LinearLoading from 'components/loading/LineraLoading';
import FormDialog from 'components/dialogs/FormDialog';
import axios from 'utils/axios-intance';
import { ITimeOffDisplay, ITimeOffRequest } from 'models/TimeOff';

const TimeOffView: React.FC = () => {
    const [openAddTimeOff, setOpenAddTimeOff] = useState<boolean>(false);
    const [isLoadingTimeOff, setIsLoadingTimeOff] = useState<boolean>(false);

    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [timeOff, setTimeOff] = useState<ITimeOffDisplay[]>([]);

    const user = useTypedSelector((state) => state.user);

    const handleSelectTimeOff = (timeOff: any | undefined) => {
        if (selected === timeOff) {
            setSelected(undefined);
        } else {
            setSelected(timeOff);
        }
    };

    const handleAddTimeOff = () => {
        setOpenAddTimeOff(true);
    };

    const handleCloseAddTimeOff = () => {
        setOpenAddTimeOff(false);
    };

    const handleAddTimeOffSuccessfull = (timeOffRequest: ITimeOffRequest | undefined) => {
        if (timeOffRequest) {
            console.log(timeOff);
            const newTimeOffs = [...timeOff, formatTimeOffDisplay(timeOffRequest)];
            setTimeOff(newTimeOffs);
        }

        handleCloseAddTimeOff();
    };

    useEffect(() => {
        setIsLoadingTimeOff(true);
        axios
            .get(
                `${
                    process.env.REACT_APP_SERVER_API
                }/company/${user.company!}/sick-request/${user.email!}`
            )
            .then((result) => {
                const timeOffRequests: ITimeOffRequest[] = result.data.timeOff;
                const timeOffDisplays: ITimeOffDisplay[] = [];

                timeOffRequests.forEach((timeOff) => {
                    timeOffDisplays.push(formatTimeOffDisplay(timeOff));
                });

                setTimeOff([...timeOffDisplays]);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoadingTimeOff(false));
    }, [user.company, user.email]);

    return (
        <Box>
            {isLoadingTimeOff ? (
                <Box>
                    <LinearLoading />
                </Box>
            ) : (
                <EnhancedTable
                    title="Sick Requests"
                    headerCells={TimeOffHeadCells}
                    id="id"
                    data={timeOff}
                    onSelect={handleSelectTimeOff}
                    selected={selected}
                    unSelectedActions={getAddAction(handleAddTimeOff, 0)}
                    selectedActions={[]}
                />
            )}
            <FormDialog open={openAddTimeOff} onClose={handleCloseAddTimeOff}></FormDialog>
        </Box>
    );
};

export default TimeOffView;
