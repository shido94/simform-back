require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const cors = require('cors')
const wlogger = require('./config/winston');
const bodyParser = require('body-parser');

const app = express();

global.Logger = wlogger;
global.domain = require("./common/domainInclude");

// mongodb configuration
connectDB();

// Set Static Folder
app.use(express.static(path.join(__dirname, 'ui')));
app.use(cors());
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(logger('dev'));
app.use(express.json());

passport(app);

//routes config
const usersRouter = require('./routes/user');
const postRouter = require('./routes/post');
app.use('/user', usersRouter);
app.use('/post', postRouter);


// On first page loaf, redirect to index.html of angular build
app.use('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/ui/index.html'));
});

// If routes not found
app.use('**', function(req, res) {
  res.status(400).json({
    success: false,
    error: 'Invalid request'
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  // render the error page
  Logger.error(err);
  res.status(err.status || 500);
  res.status(400).json({
    success: false,
    error: 'Some error occurred'
  });
});

var port = process.env.PORT || 3000;
app.set('port', port);
app.listen(port, () => {
  Logger.debug('Server running at port ' + port);
});

module.exports = app;