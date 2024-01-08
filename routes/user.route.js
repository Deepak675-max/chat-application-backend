const express = require("express");

const userRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const upload = require("../middlewares/file.middleware");
const userController = require('../controllers/user.controller');

userRouter.get('/', authMiddleware.verifyAccessToken, userController.getAllUsers);
userRouter.get('/:userId', authMiddleware.verifyAccessToken, userController.getUserDetails);
userRouter.get('/profile-picture/:userId', authMiddleware.verifyAccessToken, userController.getProfilePicture);
userRouter.put('/update-profile-photo', authMiddleware.verifyAccessToken, upload.single('userProfilePhoto'), userController.updateProfilePicture);
userRouter.get('/:userId/activity', authMiddleware.verifyAccessToken, userController.getUserActivity);



module.exports = userRouter;