require('dotenv').config();
const express = require('express');
const httpErrors = require("http-errors");

const cors = require("cors");

const authRoutes = require("./routes/user.route");

const User = require('./models/user.model');
const ForgotPasswordRequests = require('./models/forgetPasswordRequests.model');
const expenseTrackerBackendApp = express();

expenseTrackerBackendApp.use(cors());

const sequelize = require('./helper/common/init_mysql');


expenseTrackerBackendApp.use(express.json());
expenseTrackerBackendApp.use(express.urlencoded({ extended: true }));



expenseTrackerBackendApp.use("/api/auth", authRoutes);


expenseTrackerBackendApp.use(async (req, _res, next) => {
    console.log(req, _res);
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
expenseTrackerBackendApp.use((error, req, res, next) => {
    const responseStatus = error.status || 500;
    const responseMessage =
        error.message || `Cannot resolve request [${req.method}] ${req.url}`;
    if (res.headersSent === false) {
        res.status(responseStatus);
        res.send({
            error: {
                status: responseStatus,
                message: responseMessage,
            },
        });
    }
    next();
});

//models associtaions.
User.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(User, { foreignKey: 'userId' });

const port = process.env.APP_PORT;

sequelize.sync({ alter: true })
    .then(() => {
        expenseTrackerBackendApp.listen(port, () => {
            console.log(`server is listening on the port of ${port}`);
        })
    })
    .catch(error => {
        console.log(error);
        process.exit(0);
    })

process.on('SIGINT', () => {
    // Perform cleanup operations here
    console.log('Received SIGINT signal. application terminated successfully.');

    // Exit the application
    process.exit(0);
});




