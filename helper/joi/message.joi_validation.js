const joi = require('joi');

const addMessageSchema = joi.object({
    chatId: joi.number().required(),
    senderId: joi.number().required(),
    content: joi.string().required()
});

const getChatMessagesSchema = joi.object({
    chatId: joi.number().required()
});

module.exports = {
    addMessageSchema,
    getChatMessagesSchema
}

