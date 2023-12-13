const sequelize = require("../helper/common/init_mysql")
const DataTypes = require("sequelize");

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
    // Model attributes are defined here
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: true
});

module.exports = ForgotPasswordRequests;