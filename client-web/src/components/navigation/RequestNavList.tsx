import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
} from '@mui/material';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FlightIcon from '@mui/icons-material/Flight';
import SickIcon from '@mui/icons-material/Sick';

interface IRequestNavListProps {
    visible: boolean;
    navSelected: number;
}

// TO DO: Switch back to just using Nav List probably

const RequestNavList: React.FC<IRequestNavListProps> = ({ visible, navSelected }) => {
    const [openCollapse, setOpenCollapse] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleToggleCollapse = () => {
        setOpenCollapse(!openCollapse);
    };

    const handleNav = (subRoute: string) => {
        navigate(`./${subRoute}`);
    };

    return (
        <>
            <List disablePadding>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleToggleCollapse}>
                        <ListItemIcon>
                            {openCollapse ? (
                                <KeyboardArrowUpIcon color="secondary" />
                            ) : (
                                <KeyboardArrowDownIcon color="secondary" />
                            )}
                        </ListItemIcon>
                        <ListItemText primary="Request" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Collapse in={openCollapse}>
                <List disablePadding>
                    {visible && (
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleNav('request/trade')}
                                selected={navSelected === 8}
                            >
                                <ListItemIcon>
                                    <SwapHorizIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary="Trade" />
                            </ListItemButton>
                        </ListItem>
                    )}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleNav('request/time-off')}
                            selected={navSelected === 9}
                        >
                            <ListItemIcon>
                                <FlightIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Time Off" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleNav('request/sick')}
                            selected={navSelected === 10}
                        >
                            <ListItemIcon>
                                <SickIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Sick" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
};

export default RequestNavList;
