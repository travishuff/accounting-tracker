# Banana Tracker

![Version](https://img.shields.io/github/package-json/v/travishuff/accounting-tracker?label=version&cacheSeconds=300)

A React 19 inventory and reporting app for tracking banana purchases, sales, and
margin scenarios.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Install

`npm install`

## Run

From the root of this repo:

`npm run dev`

Vite serves the app on localhost and prints the active URL in the terminal.

If you manage Node with `nvm`, switch into a compatible runtime before running
the scripts:

`nvm use 25.8.0`

## Build

`npm run build`

## Verify

- `npm test`
- `npm run lint`
- `npm run format:check`
- `npm run typecheck`

## Versioning

Every merged PR bumps the version automatically based on labels:

- `semver:major`
- `semver:minor`
- `semver:patch` (default if no semver label is applied)

## API Configuration

By default, the frontend calls `http://localhost:8080/api/bananas`.

To point at a different backend, create a `.env` file and set:

`VITE_API_BASE_URL=http://your-host:your-port`

## Backend

The backend is expected to expose these endpoints:

- `POST /api/bananas` with `{"number": 5, "buyDate": "2019-05-01"}`
- `PUT /api/bananas` with `{"number": 5, "sellDate": "2019-05-06"}`
- `GET /api/bananas`
