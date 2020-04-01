import { Promise } from "bluebird";

const AWS = require('aws-sdk');


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

  getSignedUploadReq(surveyId, fileName, fileType) {
    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: this._videoUploadBucket,
        Key: this._generateFullPath(surveyId, fileName, fileType),
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
  async batchedSignedUploadReqs(surveyId, requests) {
    return Promise.map(requests, async req => {
      const resp = await this.getSignedUploadReq(surveyId, req.name, req.extension);
      return { name: req.name, extension: req.extension, key: `${req.name}.${req.extension}`, signedRequest: resp.signedRequest };
    })
  }

  _generateFullPath(surveyId, fileName, fileExt) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = this._leftPadNumber(now.getUTCMonth() + 1); // Month is zero indexed...
    const day = this._leftPadNumber(now.getUTCDate());
    return `year=${year}/month=${month}/day=${day}/survey-id=${surveyId}/${fileName}.${fileExt}`;
  }

  _leftPadNumber(num, maxLength = 2, fillStr = '0') {
    return num.toString().padStart(maxLength, '0');
  }
}