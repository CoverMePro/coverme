import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box } from '@mui/material';
import LinearLoading from 'components/loading/LineraLoading';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import { IUser } from 'models/User';

import OvertimeHeadCells from 'models/HeaderCells/OvertimeListHeadCells';

import axios from 'utils/axios-intance';
import { formatDateString } from 'utils/date-formatter';

const OvertimeView: React.FC = () => {
    const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [staff, setStaff] = useState<IUser[]>([]);

    const user = useTypedSelector((state) => state.user);

    const formatDates = (staff: IUser[]) => {
        return staff.map((user) => {
            const newHireDate = user.hireDate;
            const newOvertimeDate = user.overtimeCalloutDate;
            user.hireDate = formatDateString(newHireDate! as Date);
            user.overtimeCalloutDate = formatDateString(newOvertimeDate! as Date);
            return user;
        });
    };

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/${user.company!}/overtime-list`)
            .then((result) => {
                setStaff(formatDates(result.data.users));
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoadingStaff(false));
    }, []);

    return (
        <>
            {isLoadingStaff ? (
                <LinearLoading />
            ) : (
                <Box>
                    <EnhancedTable
                        title="Overtime List"
                        data={staff}
                        headerCells={OvertimeHeadCells}
                        id="email"
                        selected={selected}
                        onSelect={() => {}}
                        unSelectedActions={[]}
                        selectedActions={[]}
                    />
                </Box>
            )}
        </>
    );
};

export default OvertimeView;
