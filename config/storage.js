const multer = require('multer');
const multerS3 = require('multer-s3');
const randomToken = () => {
    return Math.random().toString(36).slice(-20);
}

const aws = require('aws-sdk');
const storageConfig = {
    endpoint: process.env.ENDPOINT,
    accesskey: process.env.ACCESSKEY,
    secretkey: process.env.SECRETKEY,
    bucket: process.env.BUCKET,
    url: process.env.URL
}

aws.config.update({
    endpoint: new aws.Endpoint(storageConfig.endpoint),
    accessKeyId: storageConfig.accesskey,
    secretAccessKey: storageConfig.secretkey,
    signatureVersion: 'v4',
});

const s3 = new aws.S3();


const storage = multerS3({
    s3: s3,
    bucket: storageConfig.bucket,
    acl: 'public-read',
    key: function(req, file, cb) {
        cb(null, 'profile-image/' + req.user.id + new Date() + randomToken().replace('.', ''));
    }
});

module.exports = multer({storage: storage});