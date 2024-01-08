const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const File = require('../models/file.model');
const sequelize = require('../helper/common/init_mysql')
const httpErrors = require('http-errors');
const joiChat = require('../helper/joi/chat.joi_validation');

function areArraysEqual(array1, array2) {
    // Convert arrays to sets and compare them
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    // Check if the size of both sets is the same
    if (set1.size !== set2.size) {
        return false;
    }

    // Check if all elements in set1 are present in set2
    return [...set1].every(element => set2.has(element));
}

const createGroupChat = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const userChatDetails = await joiChat.createGroupChatSchema.validateAsync(req.body);

        userChatDetails.users.push(req.user.id);

        const newFile = await File.create(req.file, { transaction });

        // Create a new chat
        const newChat = await Chat.create({
            chatName: userChatDetails.chatName,
            isGroupChat: userChatDetails.isGroupChat,
            FileId: newFile.id,
            groupAdmin: userChatDetails.isGroupChat ? req.user.id : null
        }, { transaction });


        // Add users to the chat in the join table (UserChat) automatically
        await newChat.addUsers(userChatDetails.users, { transaction });

        await transaction.commit()

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chatDetails: newChat,
                    message: "Group Chat created successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}



const createPrivateChat = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const userChatDetails = await joiChat.createPrivateChatSchema.validateAsync(req.body);

        userChatDetails.users.push(req.user.id);

        const chats = await Chat.findAll({
            include: [{
                model: User,
                attributes: ['id'],
                through: { attributes: [] }, // Exclude the join table attributes from the result
            }],
        });

        //Check if a chat already exists between the users

        const existingChats = await Promise.all(
            chats.filter((chat) => {
                const chatUsers = chat.Users.map(instance => instance.id);
                if (areArraysEqual(chatUsers, userChatDetails.users)) return chat;
            })
        )
        if (existingChats.length > 0) {
            throw httpErrors.Conflict(`Chat for the users: ${userChatDetails.users} already exist`);
        }

        // Create a new chat
        const newChat = await Chat.create({
            chatName: userChatDetails.chatName,
            isGroupChat: userChatDetails.isGroupChat,
            groupAdmin: userChatDetails.isGroupChat ? req.user.id : null
        }, { transaction });

        // Add users to the chat in the join table (UserChat) automatically
        await newChat.addUsers(userChatDetails.users, { transaction });

        await transaction.commit()

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    chatDetails: newChat,
                    message: "Private Chat created successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
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

        const chats = userDetails.Chats.map(instance => instance.get());

        await Promise.all(
            chats.map(async (chat) => {
                const chatProfilePicture = await File.findByPk(chat.FileId, {
                    attributes: ['filename']
                });
                chat.profilePicture = chatProfilePicture ? chatProfilePicture.filename : null;
            })
        )

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

        const chat = (await Chat.findOne({
            where: {
                id: chatDetails.chatId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [{
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt'],
                },
                through: { attributes: [] }, // Exclude the join table attributes from the result
            }],

        })).get();

        if (!chat) throw httpErrors.NotFound(`Chats with id: ${chatDetails.chatId} does not exist.`);

        const file = await File.findByPk(chat.FileId, {
            attributes: ['filename']
        })
        if (chat.isGroupChat) {
            const adminDetails = await User.findByPk(chat.groupAdmin);
            chat.groupAdmin = adminDetails.userName;
        }
        chat.profilePicture = file ? file.filename : null;
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
    createGroupChat,
    createPrivateChat,
    getChatDetails
}
