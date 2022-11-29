export const MapFireStoreData = <T>(id: string, data: any, includeId = true): T => {
    if (includeId) {
        return {
            id,
            ...data,
        };
    }

    return {
        ...data,
    };
};
