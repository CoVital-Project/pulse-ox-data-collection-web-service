const AWS = require("aws-sdk");

let cachedCredentialPromise = null;

export default class CredentialsService {
  constructor() {

  }

  loadCredentials() {
    if(cachedCredentialPromise) return cachedCredentialPromise;
    cachedCredentialPromise = new Promise((resolve, reject) => {
      AWS.config.getCredentials(function(err) {
        if (err) reject(err);
        else resolve(AWS.config.credentials);
      });
    });
    return cachedCredentialPromise;
  }
}