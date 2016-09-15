const BodyParser = require('body-parser');
const Bunyan = require('bunyan');
const CookieParser = require('cookie-parser');
const Express = require('express');
const FileUpload = require('express-fileupload');
const ExpressSession = require('express-session');
const Favicon = require('serve-favicon');
const FS = require('fs');
const Keycloak = require('keycloak-connect');
const Logger = require('morgan');
const Mongoose = require('mongoose');
const Path = require('path');
const Redis = require('redis');
const RequesUtil = require('./util/request_util');

const log = Bunyan.createLogger({ name : 'eternal-node:index' });

var mode = process.env.MODE ? process.env.MODE : "local";

//read properties.json
PROPERTIES = JSON.parse(FS.readFileSync('./resources/properties.json', 'utf8'))[mode];
log.info("PROPERTIES", PROPERTIES);

REDIS_CLIENT = Redis.createClient(PROPERTIES.redis.url); //connect to to redis server
Mongoose.Promise = global.Promise;
Mongoose.connect(PROPERTIES.mongodb); //connect to mongodb

const adminRoute = require('./routes/admin');
const auth = require('./routes/auth');
const m = require('./routes/m');
const routes = require('./routes/index');
const users = require('./routes/users');

var app = Express();

// view engine setup
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(Logger('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: false}));
app.use(CookieParser());
app.use(Express.static(Path.join(__dirname, 'public')));
app.use(FileUpload());

var RedisStore = require('connect-redis')(ExpressSession);

app.use(ExpressSession({
    secret: 'p7vtAfj5k~<Q2@#!',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
        client: REDIS_CLIENT
    })
}));

var keycloak = new Keycloak({
    store: RedisStore
});
app.set('keycloak', keycloak);

app.use(keycloak.middleware());

app.use('/admin', keycloak.protect((token) => {
    return token.hasRole("eternal-admin");
}), RequesUtil.authenticate, adminRoute);
app.use('/auth', keycloak.protect(), RequesUtil.authenticate, auth);
app.use('/m', RequesUtil.authAccessToken, m);
app.use('/', routes);
app.use('/users', keycloak.protect(), RequesUtil.authenticate, users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
