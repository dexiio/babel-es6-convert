# ES6 to ES5 converter service

Small service for automatically converting ES6 scripts to ES5 friendly scripts based on babeljs.

## Requirements
1. NodeJS 9+ installed
1. NPM installed
1. Docker (If running using docker)

## Running

To install modules simply run: 
```
npm install
```

And then to start the service run: 
```
node server.js
```

You should now be able to run scripts through the service via :
```
http://localhost:8899/?url=<some url to a ES6 js resource>
```


## Docker

### Building

To build docker image run 
```
docker build -t your-image-name .
```

### Running

To start the service using the public docker image use:  
```
docker run -d --rm -p 8899:8899 --name es6-converter dexi/es6-converter
```

You should now be able to run scripts through the service via :
```
http://localhost:8899/?url=<some url to a ES6 js resource>
```

