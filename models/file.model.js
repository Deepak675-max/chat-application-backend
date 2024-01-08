const sequelize = require("../helper/common/init_mysql")
const { DataTypes } = require('sequelize');

const Chat = require("./chat.model");
const User = require("./user.model");

const File = sequelize.define('File', {
    fieldname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    encoding: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true
});

File.hasOne(Chat);
File.hasOne(User);

module.exports = File;
