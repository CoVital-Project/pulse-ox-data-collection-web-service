const OpenAPIBackend = require('openapi-backend').default;
const apiSchema = require('./api_schema');
import { User } from './model/user-auto';
import CredentialsService from './service/aws/credentials';
import S3Service from './service/aws/s3';

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
  },

  getSignedUploadReq: (r, req, res) => {
    const fileName = req.query.filename;
    const fileType = req.query.filetype;

    if(!fileName || !fileType) {
      return returns.failure(r, req, res)(new Error('You must specify filename and filetype params'));
    }

    s3Service.getSignedUploadReq(fileName, fileType)
      .then(
        returns.success(r, req, res),
        returns.failure(r, req, res)
      )
      .catch(returns.failure(r, req, res));
  },

  batchedSignedUploadReq: (r, req, res) => {
    const files = req.body.files;
    const surveyId = req.body.surveyId;
    if(!files || !surveyId) return returns.failure(r, req, res)(new Error("'surveyId' and 'files' must be specified in order to retrieve signed URLs"));

    s3Service.batchedSignedUploadReqs(surveyId, files)
      .then(
        returns.success(r, req, res),
        returns.failure(r, req, res)
      )
      .catch(returns.failure(r, req, res));
  }
};

// define api
const api = new OpenAPIBackend({
  definition: apiSchema,
  handlers: {
    'get-users': handlers.getUsers,
    'get-users-userid': handlers.getUser,
    'post-users': handlers.postUsers,
    'get-signed-upload-req': handlers.getSignedUploadReq,
    'batch-signed-upload-req': handlers.batchedSignedUploadReq,
    notFound: (c, req, res) => res.status(404).json({ err: 'not found' })
  }
});

module.exports.api = api;
