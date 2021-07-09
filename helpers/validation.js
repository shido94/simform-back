var validateRequestBody = function (req, res, paramsArray) {
    var status = true;
    for (var i = 0; i < paramsArray.length; i++) {
        if (!req.body[paramsArray[i]] || (req.body[paramsArray[i]] === '')) {
            status = false;
            break;
        }
    }
    return status;
}

module.exports.validateRequestBody = validateRequestBody;