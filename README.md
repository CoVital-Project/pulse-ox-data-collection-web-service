# pulse-ox-data-collection-web-service

![Node.js CI](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/workflows/Node.js%20CI/badge.svg)

Prototypes for Hugo Esteves et al to get some node API services + NoSQL backend going

<!-- ## Local development
- Install the versions of `node` and `npm` specified in package.json
- Install deps via `npm install .`
- Verify test suite works with `npm run test`
- Verify basic web app boots with `node src/app.js`
- View the app in your browser at [http://localhost:3000/](http://localhost:3000/) -->

## Getting started:

- .env file filled with the credencials of you mongoDB
  NODE_ENV=development
  DBUSER=covital
  DBPASSWORD=my_db_password
  DBADDRESS=127.0.0.1
  DBPORT=27017
  DBNAME=covital
  DBAUTHSOURCE=covital

- MongoDB must be running
  -You can use the ./devops/mongo-db-setup.sh to create covital db automatically (mongo must be installed)
- npm install
- npm start (First test user will be added automatically trough migration)
- test you browser for "localhost:3000/diagnoses"

## Testing your PRs:
We have a github action defined in `.github/workflows/ci.yml` that will run a basic node lint/test/build pipeline. You can test locally without waiting for CI by running the following:
- `npm run ci-build`

## Running in Docker:
We are looking to set up Docker compose eventually but for now we have a simple Dockerfile for you:
- `docker build -t covital/ingress .`
- `docker run -t covital/ingress`


## Appdev TODOs

See the [GitHub issues for this project](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/issues).

## Contributing

- Changes should be PRed into `master`
- Builds must pass [all CI checks](https://github.com/CoVital-Project/pulse-ox-data-collection-web-service/actions) to merge

## Short term plan

Spike out an Express + Mongo prototype to be hosted on a simple VPS (digital ocean) with SSH access) as an outlet for any let's-get-this-going creative energies

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
