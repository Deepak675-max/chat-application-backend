const User = require('../models/user.model');
const File = require('../models/file.model');


const httpErrors = require('http-errors');
const joiUser = require('../helper/joi/user.joi_validation');
const { Op } = require('sequelize');
const UserActivity = require('../models/user_activity.model');


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
        next(error);
    }
}


const getProfilePicture = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await User.findByPk(userId);
        if (!user) throw httpErrors.NotFound('User not found');
        const fileDetials = await File.findByPk(user.FileId, {
            attributes: ['filename']
        });

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    profilePicture: fileDetials ? fileDetials.filename : null,
                    user: "Chat created successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const fileId = req.body.fileId;
        console.log("fileId = ", fileId);
        console.log("userId = ", userId);
        const user = await User.findByPk(userId);
        if (!user) throw httpErrors.NotFound('User not found');
        if (fileId === "null") {
            let newFile = await File.create(req.file);
            user.FileId = newFile.id;
            await user.save();
            console.log("created new file = ", newFile);
            console.log("updated user with new file = ", user);
        } else {
            await File.update(req.file, {
                where: {
                    id: parseInt(fileId)
                }
            })
            console.log("updated existing user  file = ", user);
        }

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Profile photo updated successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getUserActivity = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const userActivity = await UserActivity.findOne({
            where: {
                userId: userId
            }
        })
        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    userActivity: userActivity,
                    message: "User activity fetched successfully",
                },
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}


const getUserDetails = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = (await User.findByPk(userId)).get();
        if (!user) throw httpErrors.NotFound('User not found');
        const fileDetials = await File.findByPk(user.FileId, {
            attributes: ['filename']
        });
        user.profilePicture = fileDetials ? fileDetials.filename : null;
        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    userDetails: user,
                    message: "Chat fetched successfully",
                },
            });
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    getAllUsers,
    getProfilePicture,
    getUserDetails,
    updateProfilePicture,
    getUserActivity
}
