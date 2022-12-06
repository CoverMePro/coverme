import { db } from '../utils/admin';
import { WhereFilterOp, OrderByDirection } from 'firebase/firestore';
import { formatFirestoreData, handleError, mapFireStoreData } from './db-helpers';

interface ICondition {
    property: string;
    operator: WhereFilterOp;
    value: any;
}

const getData = (model: any): any => {
    const data: any = {
        ...model,
    };

    delete data.id;

    return data;
};

/** COLLECTIONS **/
const getCollection = <T>(path: string): Promise<T[]> => {
    return db
        .collection(path)
        .get()
        .then((collection) => {
            const data: T[] = formatFirestoreData(collection);

            return data;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const getCollectionsWithSort = <T>(
    path: string,
    orderBy: string,
    ordering: OrderByDirection | undefined
): Promise<T[]> => {
    return db
        .collection(path)
        .orderBy(orderBy, ordering)
        .get()
        .then((collection) => {
            const data: T[] = formatFirestoreData(collection);

            return data;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const getCollectionWithCondition = <T>(
    path: string,
    property: string,
    operator: WhereFilterOp,
    value: any
): Promise<T[]> => {
    return db
        .collection(path)
        .where(property, operator, value)
        .get()
        .then((collection) => {
            const data: T[] = formatFirestoreData(collection);

            return data;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const getCollectionChainedConditions = async <T>(
    path: string,
    conditions: ICondition[]
): Promise<T[]> => {
    try {
        let doc: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db
            .collection(path)
            .where(conditions[0].property, conditions[0].operator, conditions[0].value);

        for (let i = 1; i < conditions.length; ++i) {
            const condition = conditions[i];
            doc.where(condition.property, condition.operator, condition.value);
        }

        return doc
            .get()
            .then((collection) => {
                const data: T[] = formatFirestoreData(collection);

                return data;
            })
            .catch((error) => {
                throw handleError(error);
            });
    } catch (error) {
        throw handleError(error);
    }
};

const getDocumentFromCollectionWithCondition = <T>(
    path: string,
    property: string,
    operator: WhereFilterOp,
    value: any
): Promise<T> => {
    return db
        .collection(path)
        .where(property, operator, value)
        .limit(1)
        .get()
        .then((collection) => {
            if (collection.docs.length < 1) {
                throw new Error('Could not find document');
            }

            const data: T = mapFireStoreData(collection.docs[0].id, collection.docs[0].data());

            return data;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const getMultipleCollections = (collectionCalls: Promise<any[]>[]) => {
    return Promise.all(collectionCalls)
        .then((values) => {
            return values;
        })
        .catch((error) => {
            if (typeof error === 'string') {
                throw new Error(error);
            } else if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Unexpected error has occrued');
        });
};

const documentExistsByCondition = (
    path: string,
    property: string,
    operator: WhereFilterOp,
    value: any
): Promise<boolean> => {
    return db
        .collection(path)
        .where(property, operator, value)
        .get()
        .then((collection) => {
            return !collection.empty;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const documentExistsById = (path: string, id: string): Promise<boolean> => {
    return db
        .doc(`${path}/${id}`)
        .get()
        .then((document) => {
            return document.exists;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

/** DOCUMENTS **/
const getDocumentSnapshot = (path: string) => {
    return db.doc(path);
};

const getDocumentById = <T>(path: string, id: string): Promise<T> => {
    return db
        .doc(`${path}/${id}`)
        .get()
        .then((document) => {
            const data: T = mapFireStoreData(document.id, document.data());

            return data;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const setDocument = <T>(
    path: string,
    id: string,
    data: Partial<T>
): Promise<FirebaseFirestore.WriteResult> => {
    return db
        .doc(`${path}/${id}`)
        .set(data)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const addDocument = <T>(path: string, data: Partial<T>): Promise<T> => {
    return db
        .collection(path)
        .add(data)
        .then(async (result) => {
            try {
                const resultDoc = await result.get();

                const resultData: T = mapFireStoreData(resultDoc.id, resultDoc.data());

                return resultData;
            } catch (error) {
                throw handleError(error);
            }
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const updateDocument = <T>(
    path: string,
    id: string,
    data: Partial<T>
): Promise<FirebaseFirestore.WriteResult> => {
    return db
        .doc(`${path}/${id}`)
        .update(data)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

const deleteDocument = (path: string, id: string): Promise<FirebaseFirestore.WriteResult> => {
    return db
        .doc(`${path}/${id}`)
        .delete()
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw handleError(error);
        });
};

export default {
    getData,
    getCollection,
    getCollectionWithCondition,
    getCollectionChainedConditions,
    getCollectionsWithSort,
    getMultipleCollections,
    getDocumentById,
    getDocumentFromCollectionWithCondition,
    getDocumentSnapshot,
    setDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    documentExistsByCondition,
    documentExistsById,
};
