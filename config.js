const { join } = require('path');

module.exports = {
    PORT: process.env.PORT || 8080,
    DATABASE: join(__dirname, './bananas.json'),
};
