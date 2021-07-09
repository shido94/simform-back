const mongoose = require("mongoose");
const timestamps = require("mongoose-times");
const Schema = mongoose.Schema;
const HASH_SALT = 10;
const bcrypt = require('bcrypt');

const userSchema = Schema({
  provider: {
    type: String,
    default: 'local',
    require: true
  },
  name: {
    type: String,
    require: true,
  },
  about: {
    type: String
  },
  email: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String
  },
  password: {
    type: String
  }
});

// Password hashing
userSchema.pre('save', async function (next) {
  // Only run this function if password was modified (not on other update functions)
  if (!this.isModified('password')) return next();
  // Hash password with strength of 12
  this.password = await bcrypt.hash(this.password, HASH_SALT);
});


userSchema.methods.comparePassword = async function (data) {
  return bcrypt.compareSync(data, this.password);
};

userSchema.plugin(timestamps);
const User = module.exports =  mongoose.model("User", userSchema);


module.exports.getUserByEmail = async function(email) {
  try {
    const user = await User.findOne({email: email});
    return user;
  } catch (error) {
    throw error;
  }
};
