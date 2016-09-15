var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthToken = new Schema({
    accessToken     : String,
    uuid            : String,
    user            : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

AuthToken.index({ accessToken  : 1 });
AuthToken.index({ user         : 1 });
AuthToken.index({ createdAt    : 1 });
AuthToken.index({ updatedAt    : 1 });
AuthToken.index({ creator      : 1 });
AuthToken.index({ updater      : 1 });
AuthToken.index({ status       : 1 });

AuthToken.index({
    uuid         : 1,
    status       : 1
});

AuthToken.index({
    accessToken  : 1,
    uuid         : 1,
    status       : 1
});

module.exports = mongoose.model('AuthToken', AuthToken);