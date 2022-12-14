import { db } from "../utils/admin";

interface IBatchCommand {
    path: string;
    id: string;
}

interface IBatchDataCommand {
    path: string;
    id: string;
    data: any;
}

export const batchSetAndDelete = (
    setCommand: IBatchDataCommand,
    deleteCommand: IBatchCommand
): Promise<FirebaseFirestore.WriteResult[]> => {
    const batch = db.batch();

    batch.set(db.doc(`${setCommand.path}/${setCommand.id}`), setCommand.data);

    batch.delete(db.doc(`${deleteCommand.path}/${deleteCommand.id}`));

    return batch.commit();
};

export const updateAndDelete = (
    updateCommand: IBatchDataCommand,
    deleteCommand: IBatchCommand
) => {
    const batch = db.batch();

    batch.update(
        db.doc(`${updateCommand.path}/${updateCommand.id}`),
        updateCommand.data
    );

    batch.delete(db.doc(`${deleteCommand.path}/${deleteCommand.id}`));

    return batch.commit();
};

export const getBatch = () => {
    return db.batch();
};
