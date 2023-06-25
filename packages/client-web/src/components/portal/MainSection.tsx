import { styled } from '@mui/material/styles';

// Styling the main view to adapt to the nav drawer
// Currently it is always open, but we may change this later
const MainSection = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{}>(
	({ theme }) => ({
		flexGrow: 1,
		height: 'calc(100vh - 112px)',
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	})
);

export default MainSection;
