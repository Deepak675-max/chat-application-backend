const sequelize = require("../helper/common/init_mysql")

const DataTypes = require("sequelize");

const ForgotPasswordRequests = require('./forgetPasswordRequests.model');

const User = sequelize.define('User', {
    // Model attributes are defined here
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    timestamps: true
});

User.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(User, { foreignKey: 'userId' });

User.sync().catch(error => {
    console.log(error);
})

module.exports = User;