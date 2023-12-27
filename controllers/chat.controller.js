const User = require('../models/user.model');
const Chat = require('../models/chat.model');

const httpErrors = require('http-errors');
const joiChat = require('../helper/joi/chat.joi_validation');

const createChat = async (req, res, next) => {
    try {
        const userChatDetails = await joiChat.createChatSchema.validateAsync(req.body);

        // Check if a chat already exists between the users
        const existingChat = await Chat.findOne({
            include: [{
                model: User,
                where: { id: userChatDetails.users },
                through: { attributes: [] }, // Exclude the join table attributes from the result
            }],
        });

        if (existingChat) throw httpErrors.Conflict(`Chat for the users: ${userChatDetails.users} already exist`);

        // Create a new chat
        const newChat = await Chat.create({
            chatName: userChatDetails.chatName,
            isGroupChat: userChatDetails.isGroupChat,
            groupAdmin: userChatDetails.isGroupChat ? req.user.id : null
        });

        console.log('New Chat created:', newChat.toJSON());

        // Add users to the chat in the join table (UserChat) automatically
        await newChat.addUsers(userChatDetails.users);

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chatDetails: newChat,
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

const getChats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findByPk(userId, {
            attributes: {
                exclude: ['phoneNumber', 'password', 'createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: Chat,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    through: { attributes: [] }, // Exclude the join table attributes from the result
                },
            ],
        });

        if (!userDetails) throw httpErrors.NotFound(`Chats for user id: ${userId} does not exist.`);

        const chats = userDetails.Chats;

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chats: chats,
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
    getChats,
    createChat,
    getChatDetails
}
