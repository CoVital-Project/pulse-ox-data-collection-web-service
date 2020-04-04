const OpenAPIBackend = require('openapi-backend').default;
const apiSchema = require('./api_schema');
import { User } from './model/user-auto';
import CredentialsService from './service/aws/credentials';
import S3Service from './service/aws/s3';
import { v4 as uuidv4 } from 'uuid';

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const auth0Tenant = process.env.AUTH0_TENANT || 'o2-monitoring-dev-us';
const auth0Audience = process.env.AUTH0_AUDIENCE || 'https://pulseox-sandbox.herokuapp.com/';

// This environment variable should only be set on dev instances
const disableTokenValidation = process.env.DISABLE_TOKEN_VALIDATION_FOR_DEV === "true" || false; 

const validateJwt = jwt({
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

const env = process.env;

const credsService = new CredentialsService();
credsService.loadCredentials()
  .then(() => console.log('Successfully loaded AWS credentials!'))
  .catch(err => console.error(`Error loading AWS credentials! ${err.stack}`));

const envSignedTTL = parseInt(env.SIGNED_URL_TTL);  
const signedUrlTTL = !isNaN(envSignedTTL) ? envSignedTTL : 60; // Set low default just in case 

const s3Service = new S3Service(
  env.VIDEO_UPLOAD_BUCKET_NAME, 
  env.VIDEO_UPLOAD_BUCKET_REGION,
  signedUrlTTL
);

const returns = {
  success: (c, req, res) => {
    return result => {
      res
        .status(200)
        .json(result);
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

  getSignedUploadReq: (r, req, res) => {
    const fileName = req.query.filename;
    const fileType = req.query.filetype;

    if(!fileName || !fileType) {
      return returns.failure(r, req, res)(new Error('You must specify filename and filetype params'));
    }

    const surveyId = uuidv4();

    s3Service.getSignedUploadReq(surveyId, fileName, fileType)
      .then(
        returns.success(r, req, res),
        returns.failure(r, req, res)
      )
      .catch(returns.failure(r, req, res));
  },

  batchedSignedUploadReq: (r, req, res) => {
    const files = req.body.files;
    if(!files) return returns.failure(r, req, res)(new Error('[files] must be specified in order to retrieve signed URLs'));

    const surveyId = uuidv4();

    s3Service.batchedSignedUploadReqs(surveyId, files)
      .then(
        signedUploadRes => {
          returns.success(r, req, res)({
            surveyId: surveyId,
            signedRequests: signedUploadRes
          });
        },
        returns.failure(r, req, res)
      )
      .catch(returns.failure(r, req, res));
  }
};

const authn = {
  secureWithToken: (c, req, res, handler) => {
    if (disableTokenValidation === true) return(handler(c, req, res));
    return validateJwt(req, res, (authResponse) => {
      if (authResponse && authResponse.code === 'credentials_required'){
        return returns.notAllowed(c, req, res)(authResponse);
      }
      return(handler(c, req, res))
    });
  }
};

// define api
const api = new OpenAPIBackend({
  definition: apiSchema,
  handlers: {
    'get-users': (c, req, res) => authn.secureWithToken(c, req, res, handlers.getUsers),
    'get-users-userid': (c, req, res) => authn.secureWithToken(c, req, res, handlers.getUser),
    'post-users': (c, req, res) => authn.secureWithToken(c, req, res, handlers.postUsers),
    'get-signed-upload-req': handlers.getSignedUploadReq,
    'batch-signed-upload-req': handlers.batchedSignedUploadReq,
    notFound: (c, req, res) => res.status(404).json({ err: 'not found' })
  }
});

module.exports.api = api;
