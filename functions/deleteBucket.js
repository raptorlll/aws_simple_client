var AWS = require('aws-sdk');
// Create an S3 client
var s3 = new AWS.S3();

module.exports = (bucketName) => {
    var params = {
        Bucket: bucketName
    };

    s3.deleteBucket(params, function (err, data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            console.log(data);           // successful response
    });
};