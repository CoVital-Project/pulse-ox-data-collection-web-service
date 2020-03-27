import mongoose from 'mongoose';
import Promise from 'bluebird';

mongoose.Promise = Promise;

const options = {
  // simoes - don't buffer requests to mongo in models.
  // buffering causes errors to show up asynchronously in models, not in the connection components.
  useUnifiedTopology: true, // see https://mongoosejs.com/docs/deprecations.html
  bufferMaxEntries: 0,
  authSource: process.env.DBAUTHSOURCE,
  useFindAndModify: false,
  useNewUrlParser: true
};

/*
  Mongoose Setup
*/

// mongoose.Promise = Promise;
// mongoose.set('useCreateIndex', true);

const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbAddress = process.env.DBADDRESS;
const dbPort = process.env.DBPORT || 27017;
const dbName = process.env.DBNAME;

// MONGODB_URI is what mLab exposes by default
const herokuDbUrl = process.env.MONGODB_URI

const dbURL = herokuDbUrl || `mongodb://${dbUser}:${dbPassword}@${dbAddress}:${dbPort}/${dbName}`;

const INITIAL_RETRY_INTERVAL_MS = 2000;
const MAX_RETRY_INTERVAL_MS = 30000;

class ConnectionRetryHandler {

  constructor(initialRetryInterval, maxRetryInterval) {
    this._inReconnectWait = false;
    this._initialRetryInterval = initialRetryInterval;
    this._maxRetryInterval = maxRetryInterval;
    
    mongoose.connection.on('close', () => {
      this.waitForReconnect();
    });

    mongoose.connection.on('disconnected', () => {
      this.waitForReconnect();
    });
  }

  async tryInitialConnect() {
    await this.waitForReconnect();
  }

  async waitForReconnect(currentRetryInterval) {
    // Don't try while waiting for a reconnect
    if(this._inReconnectWait) return;

    console.info('Connection to Mongo is gone. Trying to reconnect...');

    this._inReconnectWait = true;

    let thisInterval = currentRetryInterval ? currentRetryInterval : this._initialRetryInterval;
    let nextInterval = Math.min(thisInterval * 2, this._maxRetryInterval);

    try {
      await mongoose.connect(dbURL, options);
      console.log('Successfully reconnected to Mongo!');
      this._inReconnectWait = false;
    } catch(err) {
      console.error(`Still unable to connect to mongo. Trying again in ${nextInterval / 1000} seconds`)
      setTimeout(() => {
        this._inReconnectWait = false;
        this.waitForReconnect(nextInterval);
      }, nextInterval);
    }
  }
}

const connHandler = new ConnectionRetryHandler(INITIAL_RETRY_INTERVAL_MS, MAX_RETRY_INTERVAL_MS);

export async function mongooseConnect() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  console.info('Connecting to mongo: ' + dbURL);

  await connHandler.tryInitialConnect();
}

export function mongooseDisconnect() {
  return mongoose.disconnect();
}
