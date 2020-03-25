import mongoose from 'mongoose';
import Promise from 'bluebird';

mongoose.Promise = Promise;

const options = {
  reconnectTries: 5,
  // simoes - don't buffer requests to mongo in models.
  // buffering causes errors to show up asynchronously in models, not in the connection components.
  useUnifiedTopology: false,
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
const dbURL = `mongodb://${dbUser}:${dbPassword}@${dbAddress}:${dbPort}/${dbName}`;

export function mongooseConnect() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  console.info('Connecting to mongo: ' + dbURL);

  return mongoose.connect(dbURL, options);
}

export function mongooseDisconnect() {
  return mongoose.disconnect();
}
