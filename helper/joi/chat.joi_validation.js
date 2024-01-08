const joi = require('joi');

const fileSchema = joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    size: joi.number().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    buffer: joi.binary().required(),
});

const createGroupChatSchema = joi.object({
    chatName: joi.string().trim().required(),
    isGroupChat: joi.boolean().allow(null).default(false),
    users: joi.array().items(joi.number()).min(1).required(),
});
const createPrivateChatSchema = joi.object({
    chatName: joi.string().allow(null).default(null),
    isGroupChat: joi.boolean().allow(null).default(false),
    users: joi.array().items(joi.number()).min(1).required(),
});

const getChatDetailsSchema = joi.object({
    chatId: joi.number().required()
});

module.exports = {
    createGroupChatSchema,
    createPrivateChatSchema,
    getChatDetailsSchema,
    fileSchema
}

