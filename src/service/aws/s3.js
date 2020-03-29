const AWS = require("aws-sdk");

export default class S3Service {
  constructor(defaultVideoUploadBucket, region = 'us-east-2') {
    this._videoUploadBucket = defaultVideoUploadBucket;
    this._region = region;
    this._s3 = new AWS.S3({ region: this._region });
  }

  listBuckets() {
    return new Promise((resolve, reject) => {
      this._s3.listBuckets({}, (err, result) => {
        if(err) reject(err)
        else resolve(result);
      })
    })
  }

  getSignedUploadReq(fileName, fileType) {
    return new Promise((resolve, reject) => {
      const s3Params = {
        Bucket: this._videoUploadBucket,
        Key: `${fileName}.${fileType}`,
        Expires: 60
      };
  
      this._s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err) reject(err);
        else resolve({ signedRequest: data });
      });
    });
  }
}