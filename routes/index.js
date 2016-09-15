const Bunyan = require('bunyan');
const Express = require('express');
const router = Express.Router();

const log = Bunyan.createLogger({ name : 'eternal-node:index' });

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET template page. */
router.get('/tpl/:page', function (req, res) {
    res.render('tpl/' + req.params.page, {});
});

module.exports = router;
