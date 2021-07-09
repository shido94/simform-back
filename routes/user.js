const express = require("express");
const router = express.Router();
const passport = require("passport");
const function_c = require('../helpers/functions_commons');
const jwt = require('../helpers/auth1');
const ObjectId = require('mongoose').Types.ObjectId;
const validationModule = require('../helpers/validation');
const multer = require('../config/storage');
const upload = multer.single('avatar');

router.post('/auth/signup', async (req, res) => {
  try {
    const status = validationModule.validateRequestBody(req, res, ['email', 'password', 'name']);
    if (!status) {
      Logger.error("Params missing");
      return function_c.paramMissingError(res);
    }

    // Check If user exist, return if exist
    const userData = await domain.User.getUserByEmail(req.body.email);
    if (userData) {
      Logger.error("User already exist");
      return function_c.alreadyExistError(res);
    }

    // Add new user
    const user = new domain.User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();

    Logger.info("user added");

    return function_c.actionSuccess(res, {}, 'User added');

  } catch (error) {
    Logger.error('Error adding user: ', error);
    return function_c.queryError(res);
  }
});

router.post('/login', (req, res, next) => {
  const status = validationModule.validateRequestBody(req, res, ['email', 'password']);
  if (!status) {
    Logger.error("Params missing");
    return function_c.paramMissingError(res);
  }

  passport.authenticate('local', (err, user) => {
    return afterLogin(err, user, res);
  })(req, res, next);
});

function afterLogin(err, user, res, type) {
  if (err) {
    Logger.error(err);
    return function_c.queryError(res);
  }

  // If user not found or password not matches
  if (!user) {
    return function_c.credentialsError(res);
  }

  // Create JWT Token
  const token = jwt.createToken(user._id);
  const output = {
    token: token,
    user: user
  }

  if (type && type !== 'local') {
    console.log(token);
    return res.redirect(`${process.env.UI_URL}/user/${token}`);
  } else {
    console.log(output);
    return function_c.actionSuccess(res, output);
  }
}

// Handle the facebook sign-in
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, type) => {
    return afterLogin(err, user, res, type);
  })(req, res, next);
});

router.post('/token/validate', jwt.validateToken, async function (req, res) {
  const user = await domain.User.findById(req.user.id);
  const output = {
    token: req.body.token,
    user: user
  }

  return function_c.actionSuccess(res, output);
});

// GET: display user's profile
router.get("/profile", jwt.checkAuth, async (req, res) => {
  try {

    const user = await domain.User.findById(req.user.id);
    return function_c.actionSuccess(res, user);

  } catch (error) {
    Logger.error('Error on get profiles: ', error);
    return function_c.queryError(res, error);
  }
});

// GET: display user's profile
router.put("/profile", jwt.checkAuth, async (req, res) => {
  try {
    const status = validationModule.validateRequestBody(req, res, ['name']);
    if (!status) {
      Logger.error("Params missing");
      return function_c.paramMissingError(res);
    }

    const user = await domain.User.findByIdAndUpdate(req.user.id, {
      name: req.body.name,
      about: req.body.about,
      image: req.body.image
    }, { new: true });

    return function_c.actionSuccess(res, user);

  } catch (error) {
    Logger.error('Error on get profiles: ', error);
    return function_c.queryError(res, error);
  }
});

router.post('/upload', jwt.checkAuth, upload, async (req, res) => {
  try {

    if (req.file) {
      const user = await domain.User.findByIdAndUpdate(req.user.id, {
        image: req.file.location
      }, { new: true});

      return function_c.actionSuccess(res, user);
    } else {
      return function_c.queryError(res);
    }


  } catch (error) {
    Logger.error('Error uploading profile pic: ', error);
    return function_c.queryError(res, error);
  }
});


module.exports = router;
