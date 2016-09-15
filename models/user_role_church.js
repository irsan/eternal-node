var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserRoleChurch = new Schema({
    user        : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role        : String,
    church      : { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
    createdAt   : { type : Date, default : Date.now },
    updatedAt   : { type : Date, default : Date.now },
    creator     : { type : String, default : 'System' },
    updater     : { type : String, default : 'System' },
    status      : { type : String, default : 'active' }
});

UserRoleChurch.index({ user         : 1 });
UserRoleChurch.index({ role         : 1 });
UserRoleChurch.index({ clinic       : 1 });
UserRoleChurch.index({ createdAt    : 1 });
UserRoleChurch.index({ updatedAt    : 1 });
UserRoleChurch.index({ creator      : 1 });
UserRoleChurch.index({ updater      : 1 });
UserRoleChurch.index({ status       : 1 });

UserRoleChurch.index({
    user   : 1,
    status : 1
});


UserRoleChurch.index({
    user   : 1,
    role   : 1,
    clinic : 1,
    status : 1
});

module.exports = mongoose.model('UserRoleChurch', UserRoleChurch);