var AWS = require('aws-sdk');
// Create an S3 client
var s3 = new AWS.S3();

let regionInfo = (name)=>{

    var params = {
        Bucket: "examplebucket"
    };
    s3.getBucketLocation(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
         LocationConstraint: "us-west-2"
        }
        */
    });
};
module.exports.simple = () => {
    var params = {};
    return new Promise((res, rej) => {
        s3.listBuckets(params, function(err, data) {
            if (err) rej(err); // an error occurred
            else res(data);           // successful response
        });
    });
};