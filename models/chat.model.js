const sequelize = require("../helper/common/init_mysql")

const DataTypes = require("sequelize");

const User = require('./user.model');

const Chat = sequelize.define('Chat', {
    // Model attributes are defined here
    chatName: {
        type: DataTypes.STRING,
    },
    isGroupChat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastMessage: {
        type: DataTypes.STRING,
    },
    groupAdmin: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

Chat.belongsToMany(User, { through: 'UserChat' });
User.belongsToMany(Chat, { through: 'UserChat' });

Chat.sync().catch(error => {
    console.log(error);
})

module.exports = Chat;