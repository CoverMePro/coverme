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

const BoardMessage: React.FC = () => {
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
                        <Typography variant="h2">This is the message title</Typography>
                    </Box>
                    <Box sx={{ mr: 5 }}>
                        <Typography variant="h4">Poster's Name</Typography>
                        <Typography variant="h4">{new Date().toDateString()}</Typography>
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget tristique
                    nisi. Ut a dolor viverra, sagittis arcu congue, vulputate ligula. Ut eleifend
                    lobortis nibh eget blandit. Nunc id dapibus nibh. Nulla mi lorem, sollicitudin
                    sed pulvinar sit amet, auctor non quam. Donec in pharetra diam. Praesent at eros
                    sem. Donec ligula enim, elementum nec nulla ac, malesuada malesuada tellus. Ut
                    facilisis augue sed hendrerit fringilla. Vivamus eget nulla libero. Maecenas
                    condimentum augue vitae dolor fringilla, at ultricies dui eleifend. Nullam
                    dapibus est dolor, eu congue ante congue a. Duis metus sapien, convallis in
                    velit in, efficitur ullamcorper neque. Cras fringilla cursus eros, ac
                    sollicitudin turpis dictum nec. Maecenas rhoncus, tortor consequat ultrices
                    scelerisque, metus lacus laoreet dolor, sed lobortis neque sapien quis arcu.
                    Integer vulputate, neque sit amet rhoncus sodales, arcu tortor rutrum eros, a
                    viverra arcu sapien eget orci. Sed tempor mollis dolor eget dapibus. Quisque
                    eget ultrices augue, at ullamcorper odio. Sed mollis lectus quis magna ultricies
                    convallis. Aenean aliquam purus dolor, id lacinia massa faucibus sed. Proin quis
                    vehicula diam, vel bibendum est.
                </Typography>
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
