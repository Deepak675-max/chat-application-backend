const sequelize = require("../helper/common/init_mysql")

const DataTypes = require("sequelize");
const User = require('./user.model');
const Chat = require('./chat.model');

const Message = sequelize.define('Message', {
    // Model attributes are defined here
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

Message.belongsTo(User, {
    foreignKey: 'senderId'
});
User.hasMany(Message, {
    foreignKey: 'senderId'
});

Message.belongsTo(Chat, {
    foreignKey: 'chatId'
});
Chat.hasMany(Message, {
    foreignKey: 'chatId'
});


Message.sync().catch(error => {
    console.log(error);
})

module.exports = Message;