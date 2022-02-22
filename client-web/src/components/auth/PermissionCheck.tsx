import React from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';

interface IPermissionCheckProps {
    permissionLevel?: number;
}

const PermissionCheck: React.FC<IPermissionCheckProps> = ({ permissionLevel = 0, children }) => {
    const user = useTypedSelector((state) => state.user);

    const permissionCheck = () => {
        const result: { [key: number]: any } = {
            0: true,
            1: user.role !== 'staff',
            2: user.role !== 'staff' && user.role !== 'manager',
            3: user.role === 'admin',
        };

        return result[permissionLevel] ?? true;
    };

    return <>{permissionCheck() && <>{children}</>}</>;
};

export default PermissionCheck;
