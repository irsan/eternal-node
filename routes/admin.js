const Bunyan = require('bunyan');
const Express = require('express');
const Pagination = require('../util/pagination');
const Response = require('../util/response');
const Vasync = require('vasync');

const Model = {
    Church : require('../models/church')
};

const log = Bunyan.createLogger({ name : 'eternal-node:admin' });

const router = Express.Router();

/* Admin Page. */
router.get('/', (req, res) => {
    res.render('admin', {
        title: 'Admin',
        me : JSON.stringify({
            username: req.eternalUser.username,
            displayName: req.eternalUser.displayName
        }).replace(/"/g, "\\\"").replace(/\n/g, "\\")
    });
});

router.get("/church/list/:page", (req, res) => {
    var response = new Response();
    response.data = {
        pagination : new Pagination(req.params.page, 50)
    };

    Vasync.waterfall([
        (callback) => {//count churches
            Model.Church.count({
                status : {
                    $nin : 'inactive'
                }
            }, callback);
        },
        (count, callback) => {
            response.data.count = count;

            if(count > 0) {
                Model.Church.find({
                    status : {
                        $nin : 'inactive'
                    }
                }).select('-_id')
                    .limit(response.data.pagination.limit)
                    .skip(response.data.pagination.offset)
                    .exec(callback);
            } else {
                callback(null, []);
            }
        }
    ], (err, churches) => {
        if(err) {
            response.fail(err);
        } else {
            response.data.churches = churches;
        }

        res.send(response);
    });
});

//add church
router.post("/church/add", (req, res) => {
    var church = new Model.Church(req.body.newChurch);
    church.creator = req.eternalUser.username;
    church.updater = req.eternalUser.username;

    church.save((err, church) => {
        var response = new Response();

        if(err) {
            response.fail(err);
        } else {
            response.data = {
                church : church
            };
        }

        res.send(response);
    });
});

module.exports = router;