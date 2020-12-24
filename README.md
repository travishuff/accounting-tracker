# Backend

The backend contains only 3 routes:

1. Metrics route: returns all bananas in the database
   - Route: GET `/api/bananas`
2. Purchasing route: records the purchasing of bananas from supplier
   - Route: POST `/api/bananas`
   - Inputs are specified in the request body:
     - `number`: number of bananas purchased (int)
     - `buyDate`: string in the form of YYYY-MM-DD
   - Returns array of newly purchased bananas
3. Selling route: records the selling of bananas
   - Route: PUT `/api/bananas`
   - Inputs are specified in the request body:
     - `number`: number of bananas sold (int)
     - `sellDate`: string in the form of YYYY-MM-DD
   - Returns array of bananas that were sold

Bananas are represented as an object of this shape:

```
{
  "id": "f3a6c6bb-b97e-4639-abea-f91cdf7b0444",
  "buyDate": "YYYY-MM-DD",
  "sellDate": "YYYY-MM-DD"
}
```

Newly created bananas have a `sellDate` of null. A value is assigned when they are sold. Since expiration date is not stored in the db, you'll have to manage that logic in your frontend code.

Bananas are represented as an object of this shape:

```
{
  "id": "f3a6c6bb-b97e-4639-abea-f91cdf7b0444",
  "buyDate": "YYYY-MM-DD",
  "sellDate": "YYYY-MM-DD"
}
```

Newly created bananas have a `sellDate` of null. A value is assigned when they are sold. Since expiration date is not stored in the db, you'll have to manage that logic in your frontend code.

The banana "database" persists only in memory: it is cleared whenever the server is restarted.

Given the simple nature of the backend, you'll have to manage the necessary data manipulations on the frontend.

## Install

From the root of this repo: `npm install` or `yarn`

## Run

You will need NodeJS version >= 8 installed
From the root of this repo: `npm start` or `yarn start`
By default, the server runs on localhost TCP port 8080
