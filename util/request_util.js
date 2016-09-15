const Bunyan = require('bunyan');
const Model = require('../models/model');
const UUID = require('uuid');
const Vasync = require('vasync');

const log = Bunyan.createLogger({ name : 'eternal-node:RequestUtil' });

function RequestUtil() {
}

RequestUtil.authenticate = function(req, res, next) {
    var token = req.kauth.grant.access_token;
    var isAdmin = token.content.resource_access['eternal-devt'].roles.indexOf('eternal-admin') > -1

    Vasync.waterfall([
        function(callback) {//query for user
            if(!token) {//token not found
                return callback("Token not found", null);
            }

            Model.User.findOne({
                username : token.content.preferred_username,
                status : {
                    $nin : 'inactive'
                }
            }, callback);
        },
        function(user, callback) {//create user if null
            if(!user) {//user is not in db
                //insert user (NEW USER)
                user = new Model.User({
                    key : UUID.v1(),
                    sub : token.content.sub,
                    username: token.content.preferred_username,
                    displayName : token.content.name,
                    isAdmin : isAdmin,
                    status : 'new'
                });
            } else {//user is in db update user
                user.displayName = token.content.name;
                user.sub = token.content.sub;
                user.isAdmin = isAdmin;

                if(user.status == 'pending') {
                    user.status = 'new';
                }
            }

            user.save(function(err, user) {
                if(err) {
                    return callback(err, null);
                }

                req.eternalUser = user;
                callback(null, user);
            });
        }
    ], function(err) {
        if(err) {
            log.error(err);
            res.status(500);
            return res.send(err);
        }

        next();
    });
};

RequestUtil.authAccessToken = function(req, res, next) {
    var params = (req.body.accessToken && req.body.device) ? req.body : {
        accessToken : req.get("accessToken"),
        device : req.get("device")
    };

    log.info("PARAMS ", params);

    Vasync.waterfall([
        function(callback) {
            if(!params.accessToken) {
                return callback("No privilege", null);
            }

            Model.AuthToken.findOne({
                accessToken : params.accessToken,
                status : 'active'
            }).populate('user').exec(callback);
        },
        function(authToken, callback) {
            if(!authToken) {
                return callback("No privilege", null);
            }

            var user = authToken.user;

            if(user.status == 'active' || user.status =='new') {
                callback(null, user);
            } else {
                callback("User is not active", null);
            }
        }
    ], function(error, user) {
        if(error) {
            log.error(error);
            res.status(500);
            return res.send(error);
        }

        req.eternalUser = user;
        next();
    });
};

module.exports = RequestUtil;