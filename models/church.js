var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Church = new Schema({
    name        : String,
    permlink    : String,
    createdAt   : { type : Date, default : Date.now },
    updatedAt   : { type : Date, default : Date.now },
    creator     : { type : String, default : 'System' },
    updater     : { type : String, default : 'System' },
    status      : { type : String, default : 'active' }
});

Church.index({ name      : 1 })
Church.index({ permlink  : 1 });
Church.index({ createdAt : 1 });
Church.index({ updatedAt : 1 });
Church.index({ creator   : 1 });
Church.index({ updater   : 1 });
Church.index({ status    : 1 });


module.exports = mongoose.model('Church', Church);