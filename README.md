# Problem
Bob sells bananas. Unfortunately Bob is not very organized, and has had no method for keeping track of his profits and losses... until now.

You will be building a simple bookkeeping interface for Bob using ReactJS. The backend that your interface will hook into is contained in this repo. Please clone it and develop against it. We ask that you do not commit the code in this repo to your own repository. 

Please take up to four hours to work on the solution.

# Givens
1. Bob sells each banana at a constant price of $0.35
3. Bob purchases each banana from a supplier at a cost of $0.20
2. When Bob makes a sale, he reaches for whichever bananas are nearest. Thus, he sells bananas in random order (not based on purchase date, as perhaps he should)
4. Each banana will expire 10 days from purchase date (a banana purchased on 2019-01-01 will expire on 2019-01-10, meaning it can no longer be sold on 2019-01-11)

# Requirements
Your interface should have 3 main views, and a header that allows for navigation between them:

- "Buy" form that allows Bob to record the buying of bananas from his supplier:
    - input to record number of bananas bought
    - input to record the buy date
- "Sell" form that allows Bob to record each time he sells bananas:
    - input to record number of bananas sold (NUM)
    - input to record the sell date
    - the frontent should block submission of the form if the order cannot be completed on the specified date (that is, if < NUM unexpired bananas will exist in inventory on that sellDate)
- "Anaylitics" view showing:
    - Number of remaining unexpired bananas in inventory, and their total value assuming they will be sold
    - Number of expired bananas to date, and the total spent (wasted) on them
    - Number of bananas sold to date, and the total gained from the sales them
    - Net profit or loss value to date.
    - OPTIONAL: A table of all bananas grouped primarily by buy buyDate and secondly by sellDate with the following columns:
        - buyDate
        - sellDate (the sell date if sold, null if not sold, 'EXPIRED' if not sold and past expiration)
        - Number of bananas bought on that buyDate and sold on a given date / not yet sold / expired  
        Example: 2 bananas are bought on 2019-05-01. One banana is sold on 2019-05-02. 
        If the analytics are viewed on 2019-05-10, there will be 2 rows in the table: 
            - buydate: 2019-05-01, sellDate: 2019-05-02, # bananas: 1
            - buydate: 2019-05-01, sellDate: null, # bananas: 1
        If the analytics are viewed on 2019-05-11, there will be still 2 rows in the table: 
            - buydate: 2019-05-01, sellDate: 2019-05-02, # bananas: 1
            - buydate: 2019-05-01, sellDate: EXPIRED, # bananas: 1

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

Given the simple nature of the backend, you'll have to manage the necessary data manipulations on the frontend. While this may not be the best application design, it does give you a chance to flex your muscles.

## Install
From the root of this repo: `npm install` or `yarn`

## Run
You will need NodeJS version >= 8 installed
From the root of this repo: `npm start` or `yarn start`
By default, the server runs on localhost TCP port 8080

# How We Review
Your application will be reviewed by at least two of our engineers, who will run it locally with an instance of the same backend. We value quality over feature-completeness. It is fine to leave things out provided you call them out in your project's README. The goal of this code sample is to help us understand what you consider strong code.

We do take into consideration your experience level, and will attempt to apply the following guidelines during the review process.

 - **Architecture**: How clean is the separation between concerns, i.e. data handling vs presentation?
 - **Code quality**: Is the code simple, easy to understand, and maintainable? Are there any code smells or other red flags? Is the coding style consistent with the language's guidelines? Is it consistent throughout the codebase?
 - **Clarity**: Does the project have enough comments and documentations to explain the problem and solution? Are technical tradeoffs or shortcuts explained?
 - **README** Is there a README that details how to build and run the application?
 - **Correctness**: Does the application do what was asked? If there is anything missing, does the README explain why it is missing?
 - **UX**: Is the UI intuitive and easy to use?
 - **Technical choices**: Do choices of libraries, data handling, architecture etc. seem appropriate for the application?
 - **Edge Cases**: Are inputs validated, and/or are errors handled in the UI.

## Bonus Points
 - **Routing**: If you have time, integrate a routing tool such as react-router
 - **es6**: Use a compiler such as babel so you can write modern JavaScript (es6/es7)
 - **Testing**: We welcome a preview of your unit testing skills.
 - **Build**: Extra points if you create your own build process with Webpack. Use of a generator such as Create React App is acceptable, but we expect you to understand the build process when we ask you about it in person.
 - **je ne sais quoi** Cool styling / innovative UX
