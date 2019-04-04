const router = require('express').Router();

const bananas = require('./bananas');

router.get('/', (req, res, next) => {
    res.send('hi');
});

router.route('/bananas').get(bananas.get);
router.route('/bananas').post(bananas.buy);
router.route('/bananas').put(bananas.sell);

module.exports = router;
