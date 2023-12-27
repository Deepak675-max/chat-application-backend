const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');


const httpErrors = require('http-errors');
const joiMessage = require('../helper/joi/message.joi_validation');

const addMessage = async (req, res, next) => {
    try {
        const messageDetails = await joiMessage.addMessageSchema.validateAsync(req.body);


        // Create a new chat
        const newMessage = await Message.create(messageDetails);

        console.log('New Chat created:', newMessage.toJSON());

        const chat = await Chat.findByPk(messageDetails.chatId);

        chat.lastMessage = messageDetails.content;

        await chat.save();

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chatMessageDetails: newMessage,
                    message: "Chat created successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

const getChatMessages = async (req, res, next) => {
    try {
        const chatDetails = await joiMessage.getChatMessagesSchema.validateAsync(req.params);

        const chat = await Chat.findByPk(chatDetails.chatId, {
            attributes: {
                exclude: ['phoneNumber', 'password', 'createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: Message,
                },
            ],
        });

        if (!chat) throw httpErrors.NotFound(`Chat Messages for chat id: ${chatDetails.chatId} does not exist.`);

        // const chats = userDetails.Chats;

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chatDetails: chat,
                    message: "Users Chats fetched successfully",
                },
            });
        }

    } catch (error) {
        next(error);
    }
}

const getChatDetails = async (req, res, next) => {
    try {
        const chatDetails = await joiChat.getChatDetailsSchema.validateAsync(req.params);

        const chat = await Chat.findOne({
            where: {
                id: chatDetails.chatId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [{
                model: User,
                attributes: {
                    exclude: ['phoneNumber', 'password', 'createdAt', 'updatedAt'],
                },
                through: { attributes: [] }, // Exclude the join table attributes from the result
            }],
        });

        if (!chat) throw httpErrors.NotFound(`Chats with id: ${chatDetails.chatId} does not exist.`);


        console.log("chat: ", chat);
        console.log("chat as json: ", chat.toJSON());


        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chat: chat,
                    message: "Users Chats fetched successfully",
                },
            });
        }

    } catch (error) {
        next(error);
    }
}


module.exports = {
    getChatMessages,
    addMessage,
    getChatDetails
}
