// Load required packages
const mongoose = require('mongoose');
const timestamps = require("mongoose-times");

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    title: {
        type: String
    }
});

CategorySchema.plugin(timestamps);
// Export the Mongoose model
module.exports = mongoose.model('Category', CategorySchema);