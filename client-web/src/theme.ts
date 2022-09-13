import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#006d77',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#83c5be',
        },
        background: {
            default: '#F6F6F6',
            paper: '#FFFFFA',
        },
        text: {
            primary: '#2E2727',
        },
    },
    typography: {
        h1: {
            fontSize: '38px',
        },
        h2: {
            fontSize: '30px',
        },
        h3: {
            fontSize: '24px',
        },
        h4: {
            fontSize: '20px',
        },
        h5: {
            fontSize: '18px',
        },
        body1: {
            fontSize: '14px',
        },
        body2: {
            fontSize: '12px',
        },
    },
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                    },
                },
            },
        },
    },
});
