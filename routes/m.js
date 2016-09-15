const Bunyan = require('bunyan');
const Express = require('express');
const Model = require('../models/model');
const Multer = require('multer');
const MulterS3 = require('multer-s3');
const Response = require('../util/response');
const S3Util = require('../util/s3_util');
const Vasync = require('vasync');

const router = Express.Router();

const log = Bunyan.createLogger({ name : 'eternal-node:m' });

S3Util.initS3(PROPERTIES.aws.config, PROPERTIES.aws.s3.bucket);

var upload = Multer({
    storage: MulterS3({
        s3: S3Util.getS3(),
        bucket: S3Util.getBucket() + "/uploads",
        filename: function (req, file, cb) {
            log.info("THE FILE: ", file);
            cb(null, file.originalname + Date.now());
        }
    })
});

//get me
router.post('/me', function(req, res) {
    var response = new Response();
    response.data = {
        me : {
            userKey : req.eternalUser.key,
            username : req.eternalUser.username,
            displayName : req.eternalUser.displayName,
            status : req.eternalUser.status
        }
    };
    res.send(response);
});

router.post('/churches', function(req, res) {

    Vasync.waterfall([
        function(callback) {//
            if(req.eternalUser.isAdminUser) {
                Model.Church.find({
                    status : {
                        $nin : 'inactive'
                    }
                }, callback);
            } else {//query from UserRoleChurch

            }
        }
    ], function(err, churches) {
        var response = new Response();
        if(err) {
            response.fail(err);
        } else {
            response.data = {
                churches : churches
            };
        }

        res.send(response);
    });
});

router.post('/upload', Multer({dest:'./uploads/'}).single('upl'), function(req, res) {
    console.log("UPLOAD CALLED", req.files, req.body);

    var response = new Response();
    res.send(response);
});

module.exports = router;