## AWS ClamAV Layer & a service using it to scan files
```
git clone https://github.com/sutt0n/serverless-clamav-layer
./build.sh
sls deploy
```

## Unit Tests
There's only one unit test for our handler, but to run it you'll need to install the `devDependencies` 

```
npm i
npm run test
```