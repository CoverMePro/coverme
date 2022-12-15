import React from 'react';

import { Box, Skeleton } from '@mui/material';

interface ISkeletonTeamListProps {
	loadingStaff: string[];
}

const SkeletonTeamList: React.FC<ISkeletonTeamListProps> = ({ loadingStaff }) => {
	return (
		<>
			{loadingStaff.map((user) => (
				<Box
					key={user}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Box
						sx={{
							ml: 2,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Skeleton variant="circular" width={40} height={40} />
						<Box sx={{ ml: 2 }}>
							<Skeleton variant="text" width={75} height={10} />
							<Skeleton variant="text" width={50} height={10} />
						</Box>
					</Box>

					<Box sx={{ ml: 2 }}>
						<Skeleton variant="text" width={75} height={10} />
						<Skeleton variant="text" width={75} height={10} />
					</Box>
					<Skeleton sx={{ mr: 2 }} variant="circular" width={20} height={20} />
				</Box>
			))}
		</>
	);
};

export default SkeletonTeamList;
