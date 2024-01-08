const sequelize = require("../helper/common/init_mysql");
const DataTypes = require("sequelize");

const UserActivity = sequelize.define('UserActivity', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: false
    }
}, {
    timestamps: true
});

UserActivity.sync().catch(error => {
    console.log(error);
})

module.exports = UserActivity;