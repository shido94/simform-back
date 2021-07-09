
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Strategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = function (app) {
  app.use(require('cookie-parser')());
  app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id)
    .then(function (user) {
        done(null, user)
    })
    .catch(done)
  })

  passport.use(new Strategy({
    usernameField: 'email'
  },
    function (email, password, done) {
      domain.User.getUserByEmail(email)
        .then(async function (user) {
          if (!user) {
            Logger.error('User not found');
            return done(false, null);
          }

          // bcrypt compare
          const checkPassword = await user.comparePassword(password);
          if (!checkPassword) {
            Logger.error('User not found');
            return done(false, null);
          }

          // passwords match
          return done(null, user)
        })
        .catch(error => {
          return done(error)
        })
    }));

  // Passport Google Auth
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/user/auth/google/callback`,
    passReqToCallback: true
  },
    function (request, accessToken, refreshToken, profile, done) {
      const jsonData = profile._json;
      // Check If user Exist
      domain.User.getUserByEmail(jsonData.email)
        .then(function (user) {
          if (user) {
            // If exist return
            return done(null, user)
          } else {
            // Else create new user with valid details
            const user = new User({
              provider: 'google',
              googleId: jsonData.sub,
              name: `${jsonData.given_name} ${jsonData.family_name}`,
              email: jsonData.email,
              image: jsonData.picture ? jsonData.picture : ''
            });
            user.save((err, result) => {
              if (err) {
                Logger.error('Error in saving user on google login -> ', err);
                return done(err, null);
              } else {
                return done(null, result, 'social');
              }
            });
          }
        })
        .catch(error => {
          Logger.error(error);
          return done(error);
        })
  }));



  return passport
}
