export const hasPermission = (permissionLevel: number, userRole: string) => {
    const result: { [key: number]: any } = {
        0: true,
        1: userRole !== 'staff',
        2: userRole !== 'staff' && userRole !== 'manager',
        3: userRole === 'admin',
    };

    return result[permissionLevel] ?? true;
};
