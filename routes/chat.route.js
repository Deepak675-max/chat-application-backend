const express = require("express");
const chatRouter = express.Router();
const upload = require("../middlewares/file.middleware");

const authMiddleware = require('../middlewares/auth.middleware');

const chatController = require('../controllers/chat.controller');

chatRouter.post('/group-chat', authMiddleware.verifyAccessToken, upload.single('fileInput'), chatController.createGroupChat);
chatRouter.post('/private-chat', authMiddleware.verifyAccessToken, chatController.createPrivateChat);
chatRouter.get('/chats', authMiddleware.verifyAccessToken, chatController.getChats);
chatRouter.get('/chats/:chatId', authMiddleware.verifyAccessToken, chatController.getChatDetails);

module.exports = chatRouter;