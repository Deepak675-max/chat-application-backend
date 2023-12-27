const express = require("express");

const chatRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middlewares');

const chatController = require('../controllers/chat.controller');

chatRouter.post('/chat', authMiddleware.verifyAccessToken, chatController.createChat);

// chatRouter.post('/login', chatController.loginUser);

chatRouter.get('/chats', authMiddleware.verifyAccessToken, chatController.getChats);
chatRouter.get('/chats/:chatId', authMiddleware.verifyAccessToken, chatController.getChatDetails);


// authRouter.get('/logout', authMiddleware.verifyAccessToken, chatController.logoutUser);

// authRouter.post('/forgot-password', authController.forgotPassword);
// authRouter.get('/reset-password/:id', authController.sendResetPasswordForm);
// authRouter.post('/update-password/:resetToken', authController.updatePassword);



module.exports = chatRouter;