const uuid = require('uuid');
const moment = require('moment');
const fs = require('fs');
const { promisify } = require('util');

const { DATABASE } = require('../config');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);


exports.get = async (req, res, next) => {
    try {
        const bananas = JSON.parse(await readFileAsync(DATABASE));
        res.status(200).json(bananas);
    } catch(error) {
        res.status(err.status || 500).json({ error });
    }
}


exports.buy = async (req, res, next) => {
    try {
        const { buyDate, number } = req.body;
       
        // Validate inputs
        if (typeof number !== 'number') {
            return res.status(400).send('"number" must be a Number');
        }
        if (number % 1 != 0) {
            return res.status(400).send('number must be a whole number');
        }
        if (number > 50 || number < 1) {
            return res.status(400).send('1-50 bananas per order');
        }
        if (!buyDate || !moment(buyDate, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).send('"buyDate" must be of the form "YYYY-MM-DD"');
        }

        // Construct new banana objects
        const bananas = [];
        for (let i = 0; i < number; i++) {
            bananas.push({
                id: uuid(),
                buyDate,
                sellDate: null,
            });
        }

        // Update database and respond with newly bought bananas
        const preexistingBananas = JSON.parse(await readFileAsync(DATABASE));
        await writeFileAsync(DATABASE, JSON.stringify([...preexistingBananas, ...bananas], null, 2));
        res.status(201).send(bananas);
    } catch(error) {
        res.status(error.status || 500).json({ error });
    }
}

exports.sell = async (req, res, next) => {
    try {
        const { sellDate, number } = req.body;

        // Validate inputs
        if (typeof number !== 'number') {
            return res.status(400).send('"number" must be a Number');
        }
        if (number % 1 != 0) {
            return res.status(400).send('number must be a whole number');
        }
        if (number > 50 || number < 1) {
            return res.status(400).send('1-50 bananas per order');
        }
        if (!sellDate || !moment(buyDate, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).send('"sellDate" must be of the form "YYYY-MM-DD"');
        }

        // Sell bananas
        const preexistingBananas = JSON.parse(await readFileAsync(DATABASE));
        const soldBananas = [];
        let numRemainingToSell = number;

        for (const b of preexistingBananas) {
            if (numRemainingToSell < 1) {
                break;
            }
            if (!b.sellDate && b.buyDate <= sellDate && moment(sellDate).diff(moment(b.buyDate), 'days') < 10) {
                b.sellDate = sellDate;
                soldBananas.push(b);
                numRemainingToSell--;
            }
        }

        // Update database and respond with sold bananas
        await writeFileAsync(DATABASE, JSON.stringify(preexistingBananas, null, 2));
        res.status(200).send(soldBananas);
    } catch(error) {
        res.status(error.status || 500).json({ error });
    }
}
