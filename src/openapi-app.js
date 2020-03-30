import {} from 'dotenv/config'; //tricky - Improve
import express from 'express';
import {mongooseConnect} from './config/db';

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./api_schema');
const api = require('./api').api;

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
  

const app = express();
const port = process.env.PORT || 9000;
app.set('port', port);

app.use(express.json());

api.init();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.redirect('/api-docs')
});

// validate JWT and add user to req
app.use(checkJwt);

// use as express middleware
app.use((req, res) => api.handleRequest(req, req, res));

// Tasks to run on start up
(async () => {
    try {
      await mongooseConnect();
  
      console.info('[init] Successfuly connected to mongodb');
    } catch (err) {
      console.info('[init] Mongodb connect error:\n', err);
      process.exit(2);
    }
  })();
  // start server
  app.listen(port, () =>
    console.log(`Covital backend listening on port ${port}...`)
  );