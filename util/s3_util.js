var AWS = require('aws-sdk');
var toArray = require('stream-to-array');

var s3;
var bucket;

// Constructor
function S3Util() {
};

S3Util.initS3 = function(config, s3Bucket) {
    AWS.config.update(config);

    AWS.config.region = config.region;

    s3 = new AWS.S3();

    bucket = s3Bucket;
};

S3Util.getS3 = function() { return s3; };
S3Util.getBucket = function() { return bucket; };

S3Util.list = function() {
    s3.listBuckets(function(err, data) {
        if (err) { console.log("Error:", err); }
        else {
            for (var index in data.Buckets) {
                var bucket = data.Buckets[index];
                console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
            }
        }
    });
};

S3Util.writeText = function(fileName, text, cb) {
    var myBucket = new AWS.S3({ params: { Bucket: bucket } });
    var params = { Key: fileName, Body: text };
    myBucket.upload(params, cb);
};

S3Util.get = function(fileName, callback) {
    var params = {
        Bucket: bucket, Key: fileName
    };

    var stream = s3.getObject(params).createReadStream();

    toArray(stream, callback);
};

S3Util.getStream = function(fileName) {
    var params = {
        Bucket: bucket, Key: fileName
    };

    return s3.getObject(params).createReadStream();
};

S3Util.getURL = function(key, cb) {
    var params = { Bucket: bucket, Key: key };
    s3.getSignedUrl('getObject', params, cb);
};

S3Util.delete = function (fileName, callback) {
    s3.deleteObjects({
        Bucket: bucket,
        Delete: {
            Objects: [
                { Key: fileName },
            ]
        }
    }, callback);
};

// export the class
module.exports = S3Util;