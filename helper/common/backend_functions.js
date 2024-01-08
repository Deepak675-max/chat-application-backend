const Chat = require('../../models/chat.model');
const User = require('../../models/user.model');

const getChatUsers = async (chatId) => {
    try {
        const chat = (await Chat.findOne({
            where: {
                id: chatId
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

        })).get();
        return chat.Users;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getChatUsers
}