import React from 'react';
import { Box, Button } from '@mui/material';

import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import axios from 'utils/axios-intance';

const HomeView: React.FC = () => {
    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const handleSendSms = () => {
        axios
            .post(`${process.env.REACT_APP_SERVER_API}/send-sms`, { userId: user.email })
            .then(() => {
                enqueueSnackbar('Sms Sent!!', {
                    variant: 'success',
                });
            })
            .catch((err) => {
                console.error(err);
                enqueueSnackbar('Sms was not sent', {
                    variant: 'error',
                });
            });
    };

    return (
        <Box>
            <Button onClick={handleSendSms}>Test SMS</Button>
        </Box>
    );
};

export default HomeView;
