const Bunyan = require('bunyan');
const Express = require('express');

const log = Bunyan.createLogger({ name : 'eternal-node:index' });

const router = Express.Router();


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource ' + req.isAdminUser);
});

module.exports = router;
