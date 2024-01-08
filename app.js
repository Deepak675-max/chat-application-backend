require('dotenv').config();
const express = require('express');
const httpErrors = require("http-errors");
const cors = require("cors");
const path = require("path");
const User = require('./models/user.model');
const ForgotPasswordRequests = require('./models/forgetPasswordRequests.model');
const chatAppBackend = express();
const http = require('http');
const server = http.createServer(chatAppBackend);
const initializeSocket = require('./helper/common/init_socket.io');
initializeSocket(server);

chatAppBackend.use(cors({
    origin: "http://127.0.0.1:5500"
}));

const sequelize = require('./helper/common/init_mysql');


chatAppBackend.use(express.json());
chatAppBackend.use(express.urlencoded({ extended: true }));
chatAppBackend.use(express.static(path.join(__dirname, 'public')));


// io.on('connection', (socket) => {

//     console.log('A user connected');

//     // Handle private chat
//     socket.on('privateMessage', ({ userId, message }) => {
//         const recipientSocketId = userSocketMap.get(userId);
//         if (recipientSocketId) {
//             io.to(recipientSocketId).emit('privateMessage', { userId: socket.userId, message });
//         }
//     });

//     // Handle group chat
//     socket.on('joinGroup', (groupId) => {
//         socket.join(groupId);
//         console.log(`User ${socket.userId} joined group ${groupId}`);
//     });

//     socket.on('groupMessage', ({ groupId, message }) => {
//         io.to(groupId).emit('groupMessage', { userId: socket.userId, message });
//     });

//     // Store user's socketId
//     socket.on('storeUserInfo', ({ userId }) => {
//         socket.userId = userId;
//         userSocketMap.set(userId, socket.id);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//         userSocketMap.delete(socket.userId);
//     });
// });

const authRoutes = require("./routes/auth.route");
chatAppBackend.use("/api/auth", authRoutes);

const chatRoutes = require("./routes/chat.route");
chatAppBackend.use("/api/users", chatRoutes);

const messageRoutes = require("./routes/message.route");
chatAppBackend.use("/api/chats", messageRoutes);

const userRoutes = require("./routes/user.route");
chatAppBackend.use("/api/users", userRoutes);


chatAppBackend.use(async (req, _res, next) => {
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
        server.listen(port, () => {
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




