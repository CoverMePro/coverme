import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import loginBackground from '../../images/login-background.jpg';
import logo from '../../images/cover-me-logo.png';
import { AxiosError } from 'axios';
import axios from 'utils/axios-intance';
import { IOvertime } from 'coverme-shared';

const OvertimeConfirmationView: React.FC = () => {
    const [overtimeCallout, setOvertimeCallout] = useState<IOvertime | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [completed, setCompleted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const user = searchParams.get('user');
        const overtimeId = searchParams.get('overtimeId');

        setIsLoading(true);

        axios
            .get(`${process.env.REACT_APP_SERVER_API}/overtime-callouts/${overtimeId}/${user}/info`)
            .then((overtimeInfoResult) => {
                setOvertimeCallout(overtimeInfoResult.data.overtimeCallout);
            })
            .catch((err: AxiosError) => {
                if (err.response?.status === 400) {
                    setError(
                        'A call out has not been made to you for this shift, please contact your supervisor'
                    );
                } else if (err.response?.status === 409) {
                    setCompleted(true);
                } else {
                    setError('An uknown error has occured, please contact support');
                    console.error(err);
                }
            })
            .finally(() => setIsLoading(false));
    }, [searchParams]);

    const handleAcceptCallout = () => {
        if (overtimeCallout) {
            axios
                .post(
                    `${process.env.REACT_APP_SERVER_API}/overtime-callouts/${overtimeCallout.id}/accept`,
                    {
                        email: searchParams.get('user'),
                    }
                )
                .then(() => {
                    setCompleted(true);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const handleRejectCallout = () => {
        if (overtimeCallout) {
            axios
                .post(
                    `${process.env.REACT_APP_SERVER_API}/overtime-callouts/${overtimeCallout.id}/reject`,
                    {
                        email: searchParams.get('user'),
                    }
                )
                .then(() => {
                    setCompleted(true);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    backgroundImage: `url(${loginBackground})`,
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper
                    sx={{
                        width: { xs: '80%', md: 400 },
                        height: { xs: '80%', md: 600 },
                        borderRadius: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            paddingY: 5,
                            width: '80%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <>
                            <Box>
                                <img src={logo} width={100} alt="Cover Me Logo" />
                                <Typography variant="h2">Shift Available</Typography>
                            </Box>
                            <>
                                {isLoading ? (
                                    <Box>
                                        <CircularProgress size={48} />
                                    </Box>
                                ) : (
                                    <>
                                        {error !== undefined ? (
                                            <>
                                                <Box>
                                                    <Typography variant="h3">Error</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1">{error}</Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                {completed ? (
                                                    <>
                                                        <Box>
                                                            <Typography variant="h3">
                                                                Thank you for your response!
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body1">
                                                                If you selected yes, you will
                                                                receive a follow up text letting you
                                                                know if you have receieved the
                                                                shift.
                                                            </Typography>
                                                        </Box>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {overtimeCallout?.shiftInfo}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="h5">
                                                                This shift belongs to team
                                                            </Typography>
                                                            <Typography variant="h6">
                                                                {overtimeCallout?.team}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                sx={{ mb: 2 }}
                                                                variant="body1"
                                                            >
                                                                Are you sure you want to accept this
                                                                shift?
                                                            </Typography>
                                                            <Box sx={{ width: '100%' }}>
                                                                <Button
                                                                    sx={{ width: '100%' }}
                                                                    variant="outlined"
                                                                    onClick={handleAcceptCallout}
                                                                >
                                                                    Yes
                                                                </Button>
                                                            </Box>
                                                            <Box sx={{ mt: 2, width: '100%' }}>
                                                                <Button
                                                                    sx={{ width: '100%' }}
                                                                    variant="outlined"
                                                                    color="error"
                                                                    onClick={handleRejectCallout}
                                                                >
                                                                    No
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        </>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default OvertimeConfirmationView;
