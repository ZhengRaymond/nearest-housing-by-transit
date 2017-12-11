Nearest Housing by Transit
==================================

API server implementation to calculate nearest housing, given a desired location (e.g. a user's work office). While most places and maps visualize distance as-the-crow-flies, thie app aims to give accurate information on commute time, allowing users to select housing that may seem far, but due to relative location to transit lines, may actually be very close to their work and consequently a unexpectedly convienent place to live!

### Endpoints:
```
/api/properties/:query/:distance
  params:
     query = query keyword for the location, for example, Company Name, City
     distance = distance by minutes of transit.
```

Boilerplate instructions
=================================
### Install dependencies:
`npm install`

### Start development live-reload server:
`PORT=8080 npm run dev`

### Start production server:
`PORT=8080 npm start`

### Docker Support:
```sh
cd express-es6-rest-api

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```

License
==================================

MIT
