require('dotenv').config();
const express = require('express');
const httpErrors = require("http-errors");
const cors = require("cors");
const User = require('./models/user.model');
const ForgotPasswordRequests = require('./models/forgetPasswordRequests.model');
const chatAppBackend = express();

chatAppBackend.use(cors({
    origin: "http://127.0.0.1:5500"
}));

const sequelize = require('./helper/common/init_mysql');


chatAppBackend.use(express.json());
chatAppBackend.use(express.urlencoded({ extended: true }));


const authRoutes = require("./routes/auth.route");
chatAppBackend.use("/api/auth", authRoutes);

const chatRoutes = require("./routes/chat.route");
chatAppBackend.use("/api/users", chatRoutes);

const messageRoutes = require("./routes/message.route");
chatAppBackend.use("/api/chats", messageRoutes);

const userRoutes = require("./routes/user.route");
chatAppBackend.use("/api/users", userRoutes);


chatAppBackend.use(async (req, _res, next) => {
    console.log(req, _res);
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
chatAppBackend.use((error, req, res, next) => {
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
        chatAppBackend.listen(port, () => {
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




