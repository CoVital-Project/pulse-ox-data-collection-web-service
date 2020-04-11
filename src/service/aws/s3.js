import { Promise } from 'bluebird';

const AWS = require('aws-sdk');

const ValidSources = new Set(['community', 'clinical']);
const invalidSourcesString = Array.from(ValidSources).join(', ');

export default class S3Service {
  constructor(defaultVideoUploadBucket, region = 'us-east-2', signedUrlTTL) {
    this._videoUploadBucket = defaultVideoUploadBucket;
    this._region = region;
    this._s3 = new AWS.S3({ region: this._region });
    this._signedUrlTTL = signedUrlTTL;
  }

  listBuckets() {
    return new Promise((resolve, reject) => {
      this._s3.listBuckets({}, (err, result) => {
        if(err) reject(err)
        else resolve(result);
      })
    })
  }

  getSignedUploadReq(surveyId, fileName, fileType, source) {
    return new Promise((resolve, reject) => {
      if(!ValidSources.has(source)) return reject(new Error(`Invalid source. Valid values: [${invalidSourcesString}]`));

      const s3Params = {
        Bucket: this._videoUploadBucket,
        Key: this._generateFullPath(surveyId, fileName, fileType, source),
        Expires: this._signedUrlTTL
      };
  
      this._s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err) reject(err);
        else resolve({ signedRequest: data });
      });
    });
  }

  /**
   * 
   * @param [{ name: string, extension: string }] requests 
   */
  async batchedSignedUploadReqs(surveyId, source, requests) {
    return Promise.map(requests, async req => {
      const resp = await this.getSignedUploadReq(surveyId, req.name, req.extension, source);
      return { name: req.name, extension: req.extension, key: `${req.name}.${req.extension}`, signedRequest: resp.signedRequest };
    })
  }

  _generateFullPath(surveyId, fileName, fileExt, source) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = this._leftPadNumber(now.getUTCMonth() + 1); // Month is zero indexed...
    const day = this._leftPadNumber(now.getUTCDate());
    return `source=${source}/year=${year}/month=${month}/day=${day}/survey-id=${surveyId}/${fileName}.${fileExt}`;
  }

  _leftPadNumber(num, maxLength = 2, fillStr = '0') {
    return num.toString().padStart(maxLength, fillStr);
  }
}