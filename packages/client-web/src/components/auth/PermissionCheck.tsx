import React from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

import { hasPermission } from 'utils/validations/permissions';

interface IPermissionCheckProps {
	permissionLevel?: number;
}

const PermissionCheck: React.FC<IPermissionCheckProps> = ({ permissionLevel = 0, children }) => {
	const user = useTypedSelector((state) => state.user);

	return <>{hasPermission(permissionLevel, user.role) && <>{children}</>}</>;
};

export default PermissionCheck;
