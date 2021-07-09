const express = require("express");
const router = express.Router();
const passport = require("passport");
const function_c = require('../helpers/functions_commons');
const validationModule = require('../helpers/validation');
const jwt = require('../helpers/auth1');
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('../config/storage');
const upload = multer.single('avatar');

router.post('/category', jwt.checkAuth, async (req, res) => {
  const status = validationModule.validateRequestBody(req, res, ['category']);
  if (!status) {
    Logger.error("Params missing");
    return function_c.paramMissingError(res);
  }

  try {

    let category = await domain.Category.findOne({title: req.body.category.toLowerCase()});
    if (category) {
      Logger.error('Category already Exist');
      return function_c.queryError(res, {}, 'Category already Exist');
    }

    category = new domain.Category({
      title: req.body.category.toLowerCase()
    });

    await category.save();
    return function_c.actionSuccess(res, category, 'Added');
  } catch (error) {
    Logger.error('Error in adding category: ', error);
    return function_c.queryError(res, error);
  }
});

router.get('/category', jwt.checkAuth, async (req, res) => {
  try {

    const category = await domain.Category.find().sort({created: -1});
    return function_c.actionSuccess(res, category);
  } catch (error) {
    Logger.error('Error in adding category: ', error);
    return function_c.queryError(res, error);
  }
});


// POST: Add post
router.post("/", jwt.checkAuth, upload, async (req, res) => {
  console.log(req.file);

  req.body = Object.assign({},req.body)

  try {
    const status = validationModule.validateRequestBody(req, res, ['title', 'description', 'category']);
    Logger.info("status" + status);
    if (!status) {
      return function_c.paramMissingError(res);
    }

    const post = domain.Post();
    post.image = req.file.location;
    post.title = req.body.title;
    post.description = req.body.description;
    post.category = req.body.category;
    post.userId = req.user.id;

    await post.save();
    return function_c.actionSuccess(res, post);

  } catch (error) {
    Logger.error('Error on adding post: ', error);
    return function_c.queryError(res, 'Error on adding post');
  }
});

router.get('/', jwt.checkAuth, async (req, res) => {
  try {
    const query = {
      userId: ObjectId(req.user.id)
    }

    if (req.query.title) {
      query.title = new RegExp(req.query.title, "i")
    }

    const posts = await domain.Post.aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $unwind: '$categories'
      }
    ]);

    return function_c.actionSuccess(res, posts);

  } catch (error) {
    Logger.error('Error on getting post: ', error);
    return function_c.queryError(res, error);
  }
});

router.get('/:postId', jwt.checkAuth, async (req, res) => {
  try {

    let post = await domain.Post.aggregate([
      {
        $match: {
          _id: ObjectId(req.params.postId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ]);

    post = post.length ? post[0]: {}

    const follows = await domain.Follower.findOne({userId: req.user.id, followUserId: ObjectId(post.user._id)});

    return function_c.actionSuccess(res, {post , follows});

  } catch (error) {
    Logger.error('Error on getting post details: ', error);
    return function_c.queryError(res, error);
  }
});

module.exports = router;
