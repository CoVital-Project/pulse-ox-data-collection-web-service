# pulse-ox-data-collection-web-service

![Node.js CI](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/workflows/Node.js%20CI/badge.svg)

Data collection web service for receiving and storing pulse oximetry from our CoVital mobile and web app partner projects.

<!-- ## Local development
- Install the versions of `node` and `npm` specified in package.json
- Install deps via `npm install .`
- Verify test suite works with `npm run test`
- Verify basic web app boots with `node src/app.js`
- View the app in your browser at [http://localhost:3000/](http://localhost:3000/) -->

## Getting started (locally):

- .env file filled with the credencials of you mongoDB
```console
  NODE_ENV=development
  DBUSER=covital
  DBPASSWORD=my_db_password
  DBADDRESS=127.0.0.1
  DBPORT=27017
  DBNAME=covital
  DBAUTHSOURCE=covital
```

- MongoDB must be running
  - You can use the `./devops/mongo-db-setup.sh` to create covital db automatically (`mongo` must be installed)
- `npm install`
- `npm start` (First test user will be added automatically through migration)
- Open http://localhost:9000/api-docs in a browser to confirm your install is working.

## Testing your PRs:
We have a github action defined in `.github/workflows/ci.yml` that will run a basic node lint/test/build pipeline. You can test locally without waiting for CI by running the following:
- `npm run ci-build`

## Running in Docker:

Install [Docker Compose](https://docs.docker.com/compose/install/) if you haven't already.

__NOTE:__ The Pulse web service will fail to connect to Mongo until you run the `mongo-db-setup.sh` script. Once you do, the service will automatically connect to mongo.

- Build the covital image: `docker build -t covital/ingress .`
- Compose up the platform: `docker-compose -f devops/docker/compose/docker-compose.yml up -d --no-recreate`
- Init mongo database: `cd devops && ./mongo-db-setup.sh`
- Re-run compose up to bring the web service up: `docker-compose -f devops/docker/compose/docker-compose.yml up -d --no-recreate`
- Check that all services are running: `docker-compose -f devops/docker/compose/docker-compose.yml ps`
- cUrl or use Postman to verify the edge is running: `curl -v  -XGET 'http://localhost:3000/diagnoses'`

## Testing the web service in Postman
If you don't have Postman you can download it [here](https://www.postman.com/downloads/). 
The postman collection is stored in this repo under [docs/postman/pulse-collection.json](docs/postman/pulse-collection.json)

## Testing the web service manually via SwaggerUI
- Locally: http://localhost:9000/api-docs
- Dev sandbox: https://pulseox-sandbox.herokuapp.com/
- Staging: https://guarded-crag-28391.herokuapp.com/api-docs/
- Production: N/A

## Staging and dev sandbox servers
Integrators: See https://guarded-crag-28391.herokuapp.com/api-docs/ for interactive API playground with documentation.

Backend developers: see the dev sandbox server at https://pulseox-sandbox.herokuapp.com

*ALL `master` builds on github automatically deploy to the sandbox. @dpritchett or @haggy can click a button to promote sandbox releases to staging. Let us know if this flow needs adjustment!

### Accessing heroku as a developer/operator
Contact @dpritchett to be added to the [CoVital Heroku team](https://dashboard.heroku.com/teams/covital/apps) for managing our deployments.

## Client libraries for submitting data (mobile, web, etc)

### Prebuilt client libraries
See the [Releases page](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/releases) in the repo for pregenerated client libraries for javascript, dart, and ajva.

### Build your own against the latest `master` commit
Clone this repo and run `make` to generate client bindings for multiple languages.

## AWS Integration
There are some endpoints (such as generating signed S3 upload requests) that need AWS access in order to work. You'll
need credentials setup in one of the places detailed [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html). 

## Appdev TODOs

See the [GitHub issues for this project](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/issues).

## Contributing

- Changes should be PRed into `master`
- Builds must pass [all CI checks](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/actions) to merge


## Midterm plan

- Extract node modules and API layer for porting to more scalable hosting configurations
- Separate database layer out to something like a PaaS mongo or DynamoDB setup
- Provide CI/CD to all authorized developers

## Contact

_(all contacts in the [#project-monitoring-o2](https://app.slack.com/client/TUTSYURT3/CV52VNTJM) slack room on HelpfulEngineering Slack)_

- Daniel Pritchett: Repo admin, project planning + infra + dev + arch feedback (@dpritchett)
- Hugo Esteves: Node+Mongo rapid web app dev specialist (@xtebs)
- Paulo Alfaiate: General backend/security specialist (@palfaiate)
- Dave Hagman: Platform/infrastructure automation (@haggy)
