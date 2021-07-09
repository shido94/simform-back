/**
 * Add domain name of all models to the global object as an object named "domain"
 */

const domain = {};
domain.User = require("../models/user");
domain.Post = require("../models/post");
domain.Category = require("../models/category-list");

module.exports = domain