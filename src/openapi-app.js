import {} from 'dotenv/config'; //tricky - Improve
import express from 'express';
import { mongooseConnect } from './config/db';

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./api_schema');
const api = require('./api').api;

const app = express();
const port = process.env.PORT || 9000;
app.set('port', port);

app.use(express.json());

api.init();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => { res.redirect('/api-docs') });
app.get('/swagger.json', (req, res) => { res.send(swaggerDocument) });

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
