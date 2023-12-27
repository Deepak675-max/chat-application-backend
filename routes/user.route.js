const express = require("express");

const userRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middlewares');

const userController = require('../controllers/user.controller');

userRouter.get('/', authMiddleware.verifyAccessToken, userController.getAllUsers);


module.exports = userRouter;