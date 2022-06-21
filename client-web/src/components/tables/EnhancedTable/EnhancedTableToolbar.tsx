import React from 'react';

import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { ISelectedAction, IUnselectedAction } from 'models/TableInfo';

import PermissionCheck from 'components/auth/PermissionCheck';

interface IEnhancedTableToolbarProps {
    selected: any;
    title?: string;
    unSelectedActions: IUnselectedAction[];
    selectedActions: ISelectedAction[];
}

const EnhancedTableToolbar: React.FC<IEnhancedTableToolbarProps> = ({
    selected,
    title,
    unSelectedActions,
    selectedActions,
}) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(selected !== undefined && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {selected !== undefined ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                ></Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h2" id="tableTitle" component="div">
                    {title}
                </Typography>
            )}
            {selected !== undefined ? (
                <>
                    {selectedActions.map((selectAction) => (
                        <PermissionCheck
                            key={selectAction.tooltipTitle}
                            permissionLevel={selectAction.permissionLevel}
                        >
                            <Tooltip title={selectAction.tooltipTitle}>
                                <IconButton
                                    onClick={() => selectAction.onClick(selected)}
                                    size="large"
                                >
                                    {selectAction.icon}
                                </IconButton>
                            </Tooltip>
                        </PermissionCheck>
                    ))}
                </>
            ) : (
                <>
                    {unSelectedActions.map((unSelectAction) => (
                        <PermissionCheck
                            key={unSelectAction.tooltipTitle}
                            permissionLevel={unSelectAction.permissionLevel}
                        >
                            <Tooltip title={unSelectAction.tooltipTitle}>
                                <IconButton onClick={unSelectAction.onClick} size="large">
                                    {unSelectAction.icon}
                                </IconButton>
                            </Tooltip>
                        </PermissionCheck>
                    ))}
                </>
            )}
        </Toolbar>
    );
};

export default EnhancedTableToolbar;
