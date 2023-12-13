const sequelize = require("../helper/common/init_mysql")

const DataTypes = require("sequelize");

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
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalExpense: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    isPremiumUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true
});

User.sync().catch(error => {
    console.log(error);
})

module.exports = User;