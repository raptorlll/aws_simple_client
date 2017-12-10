var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports.makePublic = (bucketName, key) => {
    return new Promise((res, rej)=>{
        var params = {
            Bucket: bucketName,
            Key: key,
            ACL: "public-read-write"
        };

        s3.putObjectAcl(params, function(err, data) {
            if (err) rej(err);
            else     res(data);
        });
    });
};


module.exports.makePrivate = (bucketName, key) => {
    return new Promise((res, rej)=>{
        var params = {
            Bucket: bucketName,
            Key: key,
            ACL: "private"
        };

        s3.putObjectAcl(params, function(err, data) {
            if (err) rej(err);
            else     res(data);
        });
    });
};