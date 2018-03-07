let createBucket = require('./functions/createBucket');
let deleteBucket = require('./functions/deleteBucket');
let listBucket = require('./functions/listBucket');
let getFiles = require('./functions/getFiles');
let deletefile = require('./functions/deletefile');
let permissionManager = require('./functions/permissionManager');

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// allow cross domain requsts
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/static', express.static(path.join(__dirname, 'static')))

//post body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/addbucket', (req, res) => {
    createBucket.simple(
        req.body.name,
        req.body.key,
        req.body.text
    );
});


app.post('/deletebucket', (req, res) => {
    deleteBucket(
        req.body.name
    );
});

app.post('/deletefile', (req, res) => {
    deletefile(
        req.body.bucket,
        req.body.name
    ).then((data)=>{
        res.send('deleted');
    });
});

app.post('/publicfile', (req, res) => {
    permissionManager.makePublic(
        req.body.bucket,
        req.body.name
    ).then((data)=>{
        res.send(data);
    })
});

app.post('/privatefile', (req, res) => {
    permissionManager.makePrivate(
        req.body.bucket,
        req.body.name
    ).then((data)=>{
        res.send(data);
    })
});


app.get('/getfilesfor', (req, res) => {
    getFiles.simple(
        req.query.name
    ).then(data=>{
        res.send(data)
    });
});

app.get('/listBucket', (req, res) => {
    listBucket.simple()
        .then((data)=>{
            res.send(data);
        })
        .catch((err) => {
            res.send([]);
        });
});

app.listen(80, () => {
    console.log('Example app listening on port 80!')
});