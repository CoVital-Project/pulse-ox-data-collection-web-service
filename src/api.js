import {requiresAuth} from 'express-openid-connect';

const OpenAPIBackend = require('openapi-backend').default;
const apiSchema = require('./api_schema');
import { User } from './model/user-auto';

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const auth0Tenant = process.env.AUTH0_TENANT || 'o2-monitoring-dev';
const auth0Audience = process.env.AUTH0_AUDIENCE || 'https://pulseox-sandbox.herokuapp.com/';

const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://' + auth0Tenant + '.auth0.com/.well-known/jwks.json'
    }),
  
    // Validate the audience and the issuer.
    audience: auth0Audience,
    issuer: 'https://' + auth0Tenant + '.auth0.com/',
    algorithms: ['RS256']
  });

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
  },
  notAllowed: (c, req, res) => {
    return err => {
      res.status(403).json({ err: err, operationId: c.operation.operationId });
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
  },

  
  secure: (c, req, res, handler) => {
    let auth = (authResponse) => {
      if (authResponse && authResponse.code === 'credentials_required'){
        return returns.notAllowed(c, req, res)(authResponse);
      }
      return(handler(c, req, res))
    };
  
    let scopes = c.operation.security.find(el => el.openId != null);

    if (scopes != null){
      return checkJwt(req, res, auth);
    }

    return handler(c, req, res);
  }
};

// define api
const api = new OpenAPIBackend({
  definition: apiSchema,
  handlers: {
    'get-users': (c, req, res) => handlers.secure(c, req, res, handlers.getUsers),
    'get-users-userid': handlers.getUser,
    'post-users': handlers.postUsers,
    notFound: (c, req, res) => res.status(404).json({ err: 'not found' })
  }
});

module.exports.api = api;
