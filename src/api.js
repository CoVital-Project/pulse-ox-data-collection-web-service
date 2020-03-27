const OpenAPIBackend = require('openapi-backend').default;
const apiSchema = require('./api_schema');
import { User } from './model/user-auto';

const returns = {
  success: (c, req, res) => {
    return result => {
      res
        .status(200)
        .json({ result: result, operationId: c.operation.operationId });
    };
  },
  failure: (c, req, res) => {
    return err => {
      res.status(500).json({ err: err, operationId: c.operation.operationId });
    };
  }
};

const handlers = {
  postUsers: (c, req, res) => {
    let userData = req.body;

    User.create(userData)
      .then(returns.success(c, req, res))
      .catch(returns.failure(c, req, res));
  },

  returnSuccess: (c, req, res) => {
    return result => {
      res
        .status(200)
        .json({ result: result, operationId: c.operation.operationId });
    };
  },

  returnFailure: (c, req, res) => {
    return err => {
      res.status(500).json({ err: err, operationId: c.operation.operationId });
    };
  },

  getUser: (c, req, res) => {
    let userId = c.request.params.userid;

    User.findOne({ uid: userId })
      .then(returns.success(c, req, res))
      .catch(returns.failure(c, req, res));
  },

  getUsers: (c, req, res) => {
    User.find({})
      .then(returns.success(c, req, res))
      .catch(returns.failure(c, req, res));
  }
};

// define api
const api = new OpenAPIBackend({
  definition: apiSchema,
  handlers: {
    'get-users': handlers.getUsers,
    'get-users-userid': handlers.getUser,
    'post-users': handlers.postUsers,
    notFound: (c, req, res) => res.status(404).json({ err: 'not found' })
  }
});

module.exports.api = api;
