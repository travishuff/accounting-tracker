# Banana Tracker

A bananas accounting system!

## Build

`npm install`

## Run

From the root of this repo: `npm run dev`

By default, the server runs on localhost TCP port 1234

## Backend

Backend repo at: https://bitbucket.org/CurrencyCap/fe-challenge/src/master/
(See README for details on building and running)

Some useful CURL requests for testing the backend:

POST:

`curl -d '{"number": 5, "buyDate": "2019-05-01"}' -H "Content-Type: application/json" -X`POST http://localhost:8080/api/bananas | jsome`

PUT:

`curl -H 'Content-Type: application/json' -X PUT -d '{"number": 5, "sellDate": "2019-05-06"}' http://localhost:8080/api/bananas | jsome`

GET:

`curl http://localhost:8080/api/bananas | jsome`

## Work In Progress

- Client-side validation
- Testing

## Notes

- Code splitting not super useful with an app this small.
