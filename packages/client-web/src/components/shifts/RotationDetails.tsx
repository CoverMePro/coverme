import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WeekRotationGrid from './WeekRotationGrid';
import { IShiftRotation } from 'coverme-shared';

interface IRotationDetailsProps {
    rotations: IShiftRotation[];
    onDelete: (rotationId: string) => void;
}

const RotationDetails: React.FC<IRotationDetailsProps> = ({ rotations, onDelete }) => {
    return (
        <>
            {rotations.map((detail) => (
                <Accordion key={detail.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h2">{detail.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <WeekRotationGrid
                            onDelete={() => onDelete(detail.id as string)}
                            rotationDetails={detail}
                        />
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default RotationDetails;
