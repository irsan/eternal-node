var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    key             : String,
    sub             : String,
    username        : String,
    displayName     : String,
    profileImage    : String,
    mobile          : String,
    isAdmin         : Boolean,
    createdAt       : { type : Date, default : Date.now },
    updatedAt       : { type : Date, default : Date.now },
    creator         : { type : String, default : 'System' },
    updater         : { type : String, default : 'System' },
    status          : { type : String, default : 'active' }
});

User.index({ key         : 1 })
User.index({ sub         : 1 });
User.index({ username    : 1 });
User.index({ displayName : 1 });
User.index({ createdAt   : 1 });
User.index({ updatedAt   : 1 });
User.index({ creator     : 1 });
User.index({ updater     : 1 });
User.index({ status      : 1 });

//for finding user based on username status and sub
User.index({
    username : 1,
    status : 1
});

module.exports = mongoose.model('User', User);