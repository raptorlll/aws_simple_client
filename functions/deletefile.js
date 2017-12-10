var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = (bucketName, key) => {
    var params = {
        Bucket: bucketName,
        Key: key
    };

    return new Promise((res, rej)=>{
        s3.deleteObject(params, function(err, data) {
            if (err) rej(err); // an error occurred
            else {
                res(data);
            }
        });
    });
};