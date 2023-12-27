const joi = require('joi');

const createChatSchema = joi.object({
    chatName: joi.string().trim().required(),
    isGroupChat: joi.boolean().allow(null).default(false),
    users: joi.array().items(joi.number()).min(1).required(),
});

const getChatDetailsSchema = joi.object({
    chatId: joi.number().required()
});

module.exports = {
    createChatSchema,
    getChatDetailsSchema
}

