# Simple Doodle

A backend and DB for a simple "group happening" API.

## Requirements

- node (v14.18.0 or above)
- docker
- docker-compose

## Installation

Setup everything:
```bash
npm install
```

Create a '.env' file in the root folder and configure:
```
PORT=<PORT NUMBER HERE>
MONGODB_URI=mongodb://localhost:27017/<DB NAME HERE>
TEST_MONGODB_URI=mongodb://localhost:27017/<TEST DB NAME HERE>
```

## Development

Backend development (first run might take a while, because mongo docker image is downloaded and setup):
```bash
npm run dev
```

Tests:
```bash
npm run test
```

Mongo CLI:
```bash
npm run devMongo
```
and
```bash
mongo <databasename>
```