const toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema');

const createMongooseSchema = require('json-schema-to-mongoose');
const mongoose = require('mongoose');

const openApiV3Schema = require('./schema');

const jsonSchema = toJsonSchema(openApiV3Schema);

const openApiToMongoose = (schemaName) => {
    const jModel = jsonSchema.components.schemas[schemaName];

    const refs = {};
    const mongooseSchema = createMongooseSchema(refs, jModel);

    const Schema = new mongoose.Schema(mongooseSchema);

    return mongoose.model(schemaName, Schema);
};

module.exports = { openApiToMongoose };




