import React, { useState } from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    AccordionActions,
    IconButton,
    Tooltip,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';

import { IMessage } from 'models/Message';

interface IBoardMessageProps {
    message: IMessage;
}

const BoardMessage: React.FC<IBoardMessageProps> = ({ message }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };
    return (
        <Accordion expanded={expanded} onChange={handleToggle}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box>
                        <Typography variant="h2">{message.title}</Typography>
                    </Box>
                    <Box sx={{ mr: 5 }}>
                        <Typography variant="h4">{message.userName}</Typography>
                        <Typography variant="h4">
                            {new Date(message.date).toDateString()}
                        </Typography>
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1">{message.content}</Typography>
            </AccordionDetails>
            <AccordionActions>
                <Tooltip title="Reply To Message">
                    <IconButton color="primary">
                        <ReplyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Acknowledge">
                    <IconButton color="primary">
                        <ThumbUpIcon />
                    </IconButton>
                </Tooltip>
            </AccordionActions>
        </Accordion>
    );
};

export default BoardMessage;
