const { MongoClient } = require("mongodb");

// Configuration values with environment fallbacks
const CONFIG = {
  host: process.env.COOKIE_EXPORT_MONGO_HOST || "mongo",
  port: process.env.COOKIE_EXPORT_MONGO_PORT || "27017",
  dbName: process.env.COOKIE_EXPORT_MONGO_DBNAME || "bbat-database",
  collection: process.env.COOKIE_EXPORT_MONGO_COL || "findings",
  poolSize: parseInt(process.env.COOKIE_EXPORT_MONGO_POOLSIZE, 10) || 10
};

const CONNECTION_URI = `mongodb://${CONFIG.host}:${CONFIG.port}/${CONFIG.dbName}`;

let mongoConnection = null;

/**
 * Initializes the MongoDB connection if not already initialized.
 * @param {Function} onReady Callback with signature (error, dbInstance)
 */
function connectToDatabase(onReady) {
  if (mongoConnection) {
    console.info("MongoDB connection already established.");
    return onReady(null, mongoConnection);
  }

  MongoClient.connect(CONNECTION_URI, { poolSize: CONFIG.poolSize })
    .then(client => {
      mongoConnection = client;
      const db = client.db();

      db.collection(CONFIG.collection).createIndex({ ts: 1, id: 1 });

      onReady(null, mongoConnection);
    })
    .catch(err => {
      onReady(err);
    });
}

/**
 * Retrieves the current MongoDB connection.
 * Throws an error if not yet connected.
 */
function getMongoConnection() {
  if (!mongoConnection) {
    throw new Error("MongoDB connection not initialized.");
  }
  return mongoConnection;
}

module.exports = {
  connectToDatabase,
  getMongoConnection,
  collection: CONFIG.collection
};
