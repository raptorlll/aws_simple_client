var AWS = require('aws-sdk');
// Create an S3 client
var s3 = new AWS.S3();

module.exports.simple = (name) => {
    var params = {
        Bucket: name,
        MaxKeys: 2
    };
    return new Promise((res, rej)=>{
        s3.listObjects(params, function(err, data) {
            if (err) rej(err); // an error occurred
            else {

                res(data.Contents.map((d)=>{
                    var params = {Bucket: name, Key: d.Key};
                    var url = s3.getSignedUrl('getObject', params);
                    d.url = url;
                    return d;
                }));
            }
        });
    });
};