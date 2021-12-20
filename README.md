# Simple Doodle

A backend and DB for a simple "group happening" API.

## Requirements

- node
- docker
- docker-compose

## Installation

Setup everything:
```bash
npm install
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