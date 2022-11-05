# AWS ClamAV Layer & a service using it to scan files

## Getting started

1. Clone this repo
2. Run `npm install`
3. Build the clamav lamber layer `bash ./build`

## Maintenance

### Code formatting

To format your code and make it easier to read:

- run `npm format`

### Dependency checking

To ensure you have the latest versions of dependencies and check for unused dependencies:

- run `npm-check`

## Deploying

Deployment can be done through your CI/CD process, or via command line:

- run `sls deploy --aws-profile <your_aws_profile>`

## Unit Tests

There's only one unit test for our handler, but to run it you'll need to install the `devDependencies`

1. run `npm i`
2. run `npm run test`
