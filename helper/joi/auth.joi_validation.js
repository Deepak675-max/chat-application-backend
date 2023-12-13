const joi = require('joi');

const signupUserSchema = joi.object({
    userName: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})

const loginUserSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required()
})

module.exports = {
    signupUserSchema,
    loginUserSchema
}

