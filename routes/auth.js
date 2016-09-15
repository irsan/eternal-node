const Bunyan = require('bunyan');
const Model = require('../models/model');
const Express = require('express');
const UUID = require('uuid');
const Vasync = require('vasync');

const router = Express.Router();

const log = Bunyan.createLogger({ name : 'eternal-node:auth' });


/* GET home page. */
router.get('/m/:uuid', function(req, res) {
    var authToken = Model.AuthToken({
        accessToken     : UUID.v1(),
        uuid            : req.params.uuid,
        user            : req.eternalUser
    });


    authToken.save(function(err, authToken) {
        if(!err && authToken) {
            console.log("AUTH TOKEEENNNNNN SAVVEEEDDDD", req.eternalUser, authToken);
            res.render('m_post_auth', {
                accessToken : authToken.accessToken
            });
        } else {
            //TODO: handle error for generating authToken
        }
    });
});

module.exports = router;