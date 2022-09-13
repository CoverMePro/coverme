import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { Box, Tab, Tabs, Typography } from '@mui/material';

import { IFullTradeDisplay, ITradeRequest } from 'models/Trade';
import { ISickDisplay, ISickRequest } from 'models/Sick';
import { ITimeOff, ITimeOffDisplay } from 'models/TimeOff';

import PageLoading from 'components/loading/PageLoading';
import TabPanel from 'components/tabs/TabPanel';
import ManagerSickRequests from 'components/manager-requests/ManagerSickRequests';
import ManagerLeaveRequests from 'components/manager-requests/ManagerLeaveRequests';
import ManagerTradeRequests from 'components/manager-requests/ManagerTradeRequests';

import {
    formatSickDisplay,
    formatTimeOffDisplay,
    formatFullTradeDisplay,
} from 'utils/formatters/display-formatter';

import axios from 'utils/axios-intance';

function groupFormat<T>(data: any[], fn: (item: any) => T) {
    return data.map((d) => fn(d));
}

const ManagerRequestView: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tabValue, setTabValue] = useState<number>(0);

    const [sick, setSick] = useState<ISickDisplay[]>([]);
    const [leave, setLeave] = useState<ITimeOffDisplay[]>([]);
    const [trade, setTrade] = useState<IFullTradeDisplay[]>([]);

    const user = useTypedSelector((state) => state.user);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        setIsLoading(true);
        const sickRequestApi = axios.post(
            `${process.env.REACT_APP_SERVER_API}/sick-requests/from-teams`,
            {
                teams: user.teams,
            }
        );
        const leaveRequestApi = axios.post(
            `${process.env.REACT_APP_SERVER_API}/time-off/from-teams`,
            {
                teams: user.teams,
            }
        );
        const tradeRequestApi = axios.post(
            `${process.env.REACT_APP_SERVER_API}/trade-request/from-teams`,
            {
                teams: user.teams,
            }
        );

        Promise.all([sickRequestApi, leaveRequestApi, tradeRequestApi])
            .then(([sickRequestResponse, leaveRequestResponse, tradeRequestRespons]) => {
                const sickRequests: ISickRequest[] = sickRequestResponse.data.sickRequests;
                const sickDisplay: ISickDisplay[] = groupFormat<ISickDisplay>(
                    sickRequests,
                    formatSickDisplay
                );

                const leaveRequests: ITimeOff[] = leaveRequestResponse.data.timeOffRequests;
                const leaveDisplay: ITimeOffDisplay[] = groupFormat<ITimeOffDisplay>(
                    leaveRequests,
                    formatTimeOffDisplay
                );

                const tradeRequests: ITradeRequest[] = tradeRequestRespons.data.tradeRequests;
                const tradeDisplay: IFullTradeDisplay[] = groupFormat<IFullTradeDisplay>(
                    tradeRequests,
                    formatFullTradeDisplay
                );

                setSick(sickDisplay);
                setLeave(leaveDisplay);
                setTrade(tradeDisplay);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [user.teams]);

    return (
        <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h1">Requests</Typography>
            </Box>
            {isLoading ? (
                <PageLoading />
            ) : (
                <>
                    <Tabs value={tabValue} onChange={handleTabChange} centered variant="fullWidth">
                        <Tab label="Sick Requests" />
                        <Tab label="Leave Requests" />
                        <Tab label="Trade Requests" />
                    </Tabs>
                    <Box>
                        <TabPanel index={0} value={tabValue}>
                            <ManagerSickRequests sickRequests={sick} />
                        </TabPanel>
                        <TabPanel index={1} value={tabValue}>
                            <ManagerLeaveRequests leaveRequest={leave} />
                        </TabPanel>
                        <TabPanel index={2} value={tabValue}>
                            <ManagerTradeRequests tradeRequests={trade} />
                        </TabPanel>
                    </Box>
                </>
            )}
        </>
    );
};

export default ManagerRequestView;
