import { openApiToMongoose } from '../open_api_to_mongoose';

const userModel = openApiToMongoose('User');

module.exports = { User: userModel };
