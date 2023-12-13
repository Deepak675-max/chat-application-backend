const express = require("express");

const authRouter = express.Router();

const verifyAccessToken = require('../middlewares/auth.middlewares');

const authController = require('../controllers/auth.controller');

authRouter.post('/signup', authController.signupUser);

authRouter.post('/login', authController.loginUser);

authRouter.get('/get-user', verifyAccessToken.verifyAccessToken, authController.getUserFromToken);

authRouter.get('/logout', verifyAccessToken.verifyAccessToken, authController.logoutUser);

authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.get('/reset-password/:id', authController.sendResetPasswordForm);
authRouter.post('/update-password/:resetToken', authController.updatePassword);



module.exports = authRouter;