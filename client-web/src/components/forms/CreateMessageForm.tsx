import React, { useState } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import {
    Box,
    CircularProgress,
    Fab,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';

import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import { IMessage } from 'models/Message';

import { validateCreateMessage } from 'utils/validations/message';
import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';

interface ICreateMessageFormProps {
    onFinish: (message: IMessage | undefined) => void;
}

const CreateMessageForm: React.FC<ICreateMessageFormProps> = ({ onFinish }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageFor, setMessageFor] = useState<string>('company');

    const user = useTypedSelector((state) => state.user);

    const { enqueueSnackbar } = useSnackbar();

    const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik({
        initialValues: {
            messageTitle: '',
            messageContent: '',
        },
        validate: validateCreateMessage,
        onSubmit: (values: any) => {
            setIsLoading(true);
            const message: IMessage = {
                title: values.messageTitle,
                content: values.messageContent,
                date: new Date(),
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                for: messageFor,
            };

            axios
                .post(`${process.env.REACT_APP_SERVER_API}/messages`, message)
                .then((result) => {
                    enqueueSnackbar('Team created.', {
                        variant: 'success',
                    });
                    console.log(result.data);
                    onFinish(result.data.message);
                })
                .catch((err: AxiosError) => {
                    console.error(err);
                    enqueueSnackbar('An error has occured, please try again', {
                        variant: 'error',
                    });
                    onFinish(undefined);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
    });

    const handleMessageForChange = (event: SelectChangeEvent) => {
        setMessageFor(event.target.value as string);
    };

    return (
        <Box
            sx={{
                width: { xs: '80%', s: 300, md: 500 },
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
                }}
            >
                <img src={logo} width={100} alt="Cover Me Logo" />
                <Typography sx={{ mb: 2 }} variant="h2">
                    Create a Message!
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel id="message-type-label">Message For</InputLabel>
                            <Select
                                labelId="message-type-label"
                                id="demo-simple-select"
                                value={messageFor}
                                label="Message For"
                                onChange={handleMessageForChange}
                            >
                                <MenuItem value={'company'}>Company</MenuItem>
                                {user.teams.map((team) => (
                                    <MenuItem key={team} value={team}>
                                        {team}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            sx={{ width: '100%' }}
                            variant="outlined"
                            type="text"
                            name="messageTitle"
                            label="Message Title"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.messageTitle &&
                                errors.messageTitle !== undefined &&
                                errors.messageTitle !== ''
                            }
                            helperText={touched.messageTitle ? errors.messageTitle : ''}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            sx={{ width: '100%' }}
                            variant="outlined"
                            multiline
                            rows={10}
                            type="text"
                            name="messageContent"
                            label="Message Content"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                                touched.messageContent &&
                                errors.messageContent !== undefined &&
                                errors.messageContent !== ''
                            }
                            helperText={touched.messageContent ? errors.messageContent : ''}
                        />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Fab color="primary" aria-label="Register User" type="submit">
                                <HowToRegIcon fontSize="large" />
                            </Fab>
                        )}
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default CreateMessageForm;
