const OpenAPIBackend = require('openapi-backend').default;
const schema = require('./schema');

import { User } from './model/user-auto';

const postUsers = (c, req, res) => {
    let userData = req.body;

    User.create(userData).
    then((result) => {
        res.status(200).json({ result: result, operationId: c.operation.operationId })
    }).catch((err) => {
        res.status(500).json({err: err, operationId: c.operation.operationId })
    });
};

const getUser = (c, req, res) => {
    let userId = c.request.params.userid;

    User.findOne({ uid: userId}).
    then((result) => {
        res.status(200).json({ result: result, operationId: c.operation.operationId })
    }).catch((err) => {
        res.status(500).json({err: err, operationId: c.operation.operationId })
    });
};

const getUsers = (c, req, res) => {
    User.find({}).
    then((result) => {
        res.status(200).json({ result: result, operationId: c.operation.operationId })
    }).catch((err) => {
        res.status(500).json({err: err, operationId: c.operation.operationId })
    });
};

// define api
const api = new OpenAPIBackend({
    definition: schema,
    handlers: {
        'get-users': getUsers,
        'get-users-userid': getUser,
        'post-users': postUsers,
        'notFound': (c, req, res) => res.status(404).json({err: 'not found'})
    }
});

module.exports.api = api;
