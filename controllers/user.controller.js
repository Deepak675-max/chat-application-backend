const User = require('../models/user.model');

const httpErrors = require('http-errors');
const joiUser = require('../helper/joi/user.joi_validation');
const { Op } = require('sequelize');


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.not]: req.user.id,
                },
            },
            attributes: {
                exclude: ['phoneNumber', 'password', 'createdAt', 'updatedAt'],
            }
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    users: users,
                    user: "Chat created successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        if (error?.isJoi === true) error.status = 422;
        next(error);
    }
}

module.exports = {
    getAllUsers
}
