import { Collection, Db, FindCursor, FindOptions, IndexSpecification, MongoClient } from "mongodb";

let _client: MongoClient;

export async function initConnection(mongoUrl: string, socketTimeoutMS: number = 360000): Promise<MongoClient> {
    return new Promise<MongoClient>((resolve, reject) => {
        _client = new MongoClient(mongoUrl, { socketTimeoutMS: socketTimeoutMS });
        _client.connect((error => {
            if (error != null) reject(error);
            resolve(_client);
        }));
    });
}

export async function getConnection() {
    return _client;
}

export async function closeConnection(): Promise<void> {
    await _client.close();
}

export async function getDb(dbName: string | undefined): Promise<Db> {
    return _client.db(dbName);
}

export async function collectionExists(collectionName: string, db: Db): Promise<boolean> {
    const targetCollections = await db.listCollections().toArray();
    const collections = targetCollections.find(collection => {
        return collection.name == collectionName;
    });

    return collections != null;
}

export async function createCollectionIfNotExists(collectionName: string, database: Db, indexSpec: IndexSpecification | null = null): Promise<void> {
    const exists: boolean = await collectionExists(collectionName, database);
    if (!exists) {
        await database.createCollection(collectionName);
        if (indexSpec) await database.collection(collectionName).createIndex(indexSpec);
    }
}

export async function dropCollectionIfExists(collectionName: string, database: Db): Promise<void> {
    if (await collectionExists(collectionName, database)) {
        console.log(`Dropping ${collectionName} from ${printDatabase(database)}`);
        await database.collection(collectionName).drop();
    }
}

export async function insertMany<T>(documents: T[], targetCollection: Collection): Promise<number> {
    const insertManyRes = await targetCollection.insertMany(documents);
    const inserted = insertManyRes.insertedCount;
    console.assert(inserted == documents.length);
    return inserted;
}

function printDatabase(database: Db) {
    return `${database.databaseName}`;
}

/**
 * returns an array of objects which have an id that is included in ids arg
 * @param ids 
 * @param collectionName
 * @param options - e.g. projection
 * @returns 
*/
export const getIdsFromCollection = async (ids: number[], collectionName: string, options: FindOptions | undefined = undefined) => {
    const db = await getDb(process.env.MONGO_INITDB_DATABASE);
    
    if (await collectionExists(collectionName, db)){
        const collection = db.collection(collectionName);
        return collection.find({_id: {$in : ids}}, options).toArray();
    };
}


export async function setUpDB() {
    await initConnection(<string>process.env.MONGO_URL);
    const db = await getDb(process.env.MONGO_INITDB_DATABASE);
    await createCollectionIfNotExists("items", db);
    await createCollectionIfNotExists("achievements", db, {name: 1});

    //await insertAchievementsToDB();
}
