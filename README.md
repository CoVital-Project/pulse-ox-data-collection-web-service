# node-mongo-backend-spike
![Node.js CI](https://github.com/CoVital-Project/node-mongo-backend-spike/workflows/Node.js%20CI/badge.svg)

Prototypes for Hugo Esteves et al to get some node API services + NoSQL backend going

## Local development
- Install the versions of `node` and `npm` specified in package.json
- Install deps via `npm install .`
- Verify test suite works with `npm run test`
- Verify basic web app boots with `node src/app.js`
- View the app in your browser at [http://localhost:3000/](http://localhost:3000/)

## Appdev TODOs
See the [GitHub issues for this project](https://github.com/CoVital-Project/node-mongo-backend-spike/issues).

## Contributing
- Changes should be PRed into `master`
- Builds must pass [all CI checks](https://github.com/CoVital-Project/node-mongo-backend-spike/actions) to merge

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
