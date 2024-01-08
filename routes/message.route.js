const express = require("express");

const messageRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const messageController = require('../controllers/message.controller');

messageRouter.post('/message', authMiddleware.verifyAccessToken, messageController.addMessage);


messageRouter.get('/:chatId/messages', authMiddleware.verifyAccessToken, messageController.getChatMessages);
// messageRouter.get('/chats/:chatId', authMiddleware.verifyAccessToken, chatController.getChatDetails);


module.exports = messageRouter;