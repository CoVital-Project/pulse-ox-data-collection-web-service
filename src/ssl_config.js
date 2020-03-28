const fs = require('fs');

const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');

const {auth} = require('express-openid-connect');

const config = {
    required: false,
    auth0Logout: true,
    baseURL: 'https://localhost:9000',
    issuerBaseURL: 'https://he-sandbox.auth0.com',
    clientID: 'NGLU1tegg8cSmSWifjSvA5P63KOo2X3Q',
    appSessionSecret: 'a long, randomly-generated string stored in env'
};

const {requiresAuth} = require('express-openid-connect');

module.exports = {
    sslCert: cert,
    auth: () => {
        return auth(config)
    },
    requiresAuth: requiresAuth,
    sslOpts: {key, cert}
};
