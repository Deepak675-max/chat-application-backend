const sequelize = require("../helper/common/init_mysql")

const DataTypes = require("sequelize");

const UserSocket = sequelize.define('UserSocket', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: true
});


UserSocket.sync().catch(error => {
    console.log(error);
})

module.exports = UserSocket;