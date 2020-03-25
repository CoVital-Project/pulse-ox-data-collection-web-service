import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
import Bluebird from 'bluebird';
Bluebird.promisifyAll(MongoClient);
export default class MigrateDbStore {
  constructor() {
    let dbUser = process.env.DBUSER,
      dbPassword = process.env.DBPASSWORD,
      dbAddress = process.env.DBADDRESS,
      dbPort = process.env.DBPORT || 27017,
      dbName = process.env.DBNAME,
      dbURL = `mongodb://${dbUser}:${dbPassword}@${dbAddress}:${dbPort}/${dbName}`;
    this.dbURL = dbURL;
    this.mClient = null;
  }
  connect() {
    return MongoClient.connect(
      this.dbURL,
      { useNewUrlParser: true }
    ).then(client => {
      this.mClient = client;
      return client.db();
    });
  }
  load(fn) {
    return this.connect()
      .then(db =>
        db
          .collection('migrations')
          .find()
          .toArray()
      )
      .then(data => {
        if (!data.length) return fn(null, {});
        const store = data[0];
        // Check if does not have required properties
        if (
          !Object.prototype.hasOwnProperty.call(store, 'lastRun') ||
          !Object.prototype.hasOwnProperty.call(store, 'migrations')
        ) {
          return fn(new Error('Invalid store file'));
        }
        return fn(null, store);
      })
      .catch(fn);
  }
  save(set, fn) {
    return this.connect()
      .then(db =>
        db.collection('migrations').updateOne(
          {},
          {
            $set: {
              lastRun: set.lastRun,
              migrations: set.migrations
            }
          },
          {
            upsert: true,
            multi: true
          }
        )
      )
      .then(result => fn(null, result))
      .catch(fn);
  }
}
