import React, { useState, useEffect, useCallback } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IUser } from 'models/User';
import { ITeamInfo } from 'models/Team';
import { ILastCallouts } from 'models/LastCallouts';
import OvertimeHeadCells from 'models/HeaderCells/OvertimeListHeadCells';
import PageLoading from 'components/loading/PageLoading';
import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import { formatDateString } from 'utils/formatters/dateTime-formatter';
import axios from 'utils/axios-intance';

// TO DO: Look to refactor some of this
const OvertimeListView: React.FC = () => {
    const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
    const [selected, setSelected] = useState<any | undefined>(undefined);
    const [staff, setStaff] = useState<IUser[]>([]);
    const [lastCallouts, setLastCallouts] = useState<ILastCallouts | undefined>(undefined);
    const [filteredStaff, setFilteredStaff] = useState<IUser[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('all');

    const user = useTypedSelector((state) => state.user);

    const formatDates = (staff: IUser[]) => {
        return staff.map((user) => {
            const newHireDate = user.hireDate;
            user.hireDate = formatDateString(newHireDate! as Date);
            return user;
        });
    };

    const clearCheck = (staff: IUser[]) => {
        return staff.map((user) => {
            user.lastCalledOut = undefined;
            return user;
        });
    };

    const formatLastCalloutStaff = useCallback(
        (staff: IUser[], lastCallouts: ILastCallouts | undefined, teams: string) => {
            const newStaff = clearCheck([...staff]);

            if (teams === 'all') {
                if (!lastCallouts || !lastCallouts.external || !lastCallouts.external.email) {
                    newStaff[0].lastCalledOut = (
                        <CheckCircleIcon color="primary" fontSize="medium" />
                    );
                    return newStaff;
                }

                const lastExternalCallout = lastCallouts.external.email;

                newStaff.forEach((user) => {
                    if (user.email! === lastExternalCallout)
                        user.lastCalledOut = <CheckCircleIcon color="primary" fontSize="medium" />;
                });

                return newStaff;
            }

            const teamFilteredStaff = newStaff.filter((user) => userContainsTeam(user, teams));

            if (!lastCallouts || !lastCallouts.internal || !lastCallouts.internal[teams]) {
                teamFilteredStaff[0].lastCalledOut = (
                    <CheckCircleIcon color="primary" fontSize="medium" />
                );
                return teamFilteredStaff;
            }

            const lastInternalCallout = lastCallouts.internal[teams];

            teamFilteredStaff.forEach((user) => {
                if (user.id! === lastInternalCallout)
                    user.lastCalledOut = <CheckCircleIcon color="primary" fontSize="medium" />;
            });

            return teamFilteredStaff;
        },
        []
    );

    const handleSelectStaff = (staff: IUser | undefined) => {
        if (selected === staff) {
            setSelected(undefined);
        } else {
            setSelected(staff);
        }
    };

    const userContainsTeam = (user: IUser, team: string) => {
        if (!user.teams || user.teams.length === 0) {
            return false;
        }

        return user.teams.findIndex((t) => t === team) !== -1;
    };

    // const filterListByTeam = (team: string) => {
    //     let newFilteredStaff: IUser[] = [];
    //     if (team === 'all') {
    //         newFilteredStaff = [...staff];
    //     } else {
    //         newFilteredStaff = staff.filter((user) => userContainsTeam(user, team));
    //     }

    //     setFilteredStaff([...newFilteredStaff]);
    // };

    const handleTeamChange = (event: SelectChangeEvent) => {
        const team = event.target.value as string;
        const newStaffList = formatLastCalloutStaff([...staff], lastCallouts, team);
        setFilteredStaff([...newStaffList]);
        setSelectedTeam(team);
    };

    const setTeamsSelect = (incomingTeams: ITeamInfo[]) => {
        const teamNames = incomingTeams.map((team) => {
            return team.name;
        });

        setTeams([...teamNames]);
    };

    useEffect(() => {
        setIsLoadingStaff(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/overtime-callouts/list`)
            .then((result) => {
                const fetchedStaff = formatDates(result.data.users);
                const fetchedLastCallouts = result.data.lastCallouts;

                const formattedFetchedStaff = formatLastCalloutStaff(
                    fetchedStaff,
                    fetchedLastCallouts,
                    'all'
                );

                setStaff(formattedFetchedStaff);
                setFilteredStaff(formattedFetchedStaff);
                setLastCallouts(fetchedLastCallouts);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoadingStaff(false));

        axios
            .get(`${process.env.REACT_APP_SERVER_API}/teams`)
            .then((result) => {
                const incomingTeams: ITeamInfo[] = result.data;
                setTeamsSelect(incomingTeams);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [user.company, formatLastCalloutStaff]);

    return (
        <>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h1">Overtime List</Typography>
                <FormControl>
                    <InputLabel id="team-lable">Teams</InputLabel>
                    <Select
                        labelId="team-lable"
                        value={selectedTeam}
                        label="Teams"
                        onChange={handleTeamChange}
                    >
                        <MenuItem value={'all'}>All Teams</MenuItem>
                        {teams.map((team) => {
                            return (
                                <MenuItem key={team} value={team}>
                                    {team}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>
            {isLoadingStaff ? (
                <PageLoading />
            ) : (
                <Box>
                    <EnhancedTable
                        data={filteredStaff}
                        headerCells={OvertimeHeadCells}
                        id="email"
                        selected={selected}
                        onSelect={handleSelectStaff}
                        unSelectedActions={[]}
                        selectedActions={[]}
                    />
                </Box>
            )}
        </>
    );
};

export default OvertimeListView;
