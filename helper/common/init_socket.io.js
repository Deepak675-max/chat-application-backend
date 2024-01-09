const socketIo = require("socket.io");

// User Socket Map to store socketId for each user
const userSocketMap = new Map();

const UserSocket = require("../../models/user_socket.model");
const UserActivity = require("../../models/user_activity.model");
const { getChatUsers } = require("./backend_functions");


function initializeSocket(server) {

    const io = socketIo(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://13.200.172.204" //specific origin you want to give access to,
        }
    });

    console.log("function is running successfully");

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle private chat
        socket.on('privateMessage', async ({ userId, message }) => {
            const socketInfo = await UserSocket.findOne({
                where: {
                    userId: userId
                }
            })
            if (socketInfo.socketId) {
                io.to(socketInfo.socketId).emit('privateMessage', { userId: socket.userId, message: message });
            }
        });

        // Handle group chat
        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`User ${socket.userId} joined group ${groupId}`);
        });

        socket.on('groupMessage', async ({ groupId, message }) => {
            const chatUsers = await getChatUsers(groupId);
            await Promise.all(
                chatUsers.map(async (user) => {
                    if (user.id != socket.userId) {
                        const socketInfo = await UserSocket.findOne({
                            where: {
                                userId: user.id
                            }
                        })
                        if (socketInfo) {
                            io.to(socketInfo.socketId).emit('groupMessage', { userId: socket.userId, message: message });
                        }
                    }
                })
            )
        });

        // Store user's socketId
        socket.on('storeUserInfo', async ({ userId }) => {
            socket.userId = userId;
            const existingActivity = await UserActivity.findOne({
                where: {
                    userId: userId
                }
            })
            if (existingActivity) {
                await existingActivity.update({ status: "Online" });
                io.emit('getUserActivityStatus', { userId: userId, status: "Online" });
            }
            else {
                await UserActivity.create({ userId: userId, status: "Online" });
                io.emit('getUserActivityStatus', { userId: userId, status: "Online" });
            }
            const socketInfo = await UserSocket.findOne({
                where: {
                    userId: userId
                }
            });
            if (socketInfo) {
                UserSocket.update({ userId: userId, socketId: socket.id }, {
                    where: {
                        id: socketInfo.id
                    }
                })
                console.log("socket updated with new socket id.");
            }
            else {
                const newScoketStored = await UserSocket.create({ userId: userId, socketId: socket.id })
                console.log("user info stored successfully.", newScoketStored);
            }
        });

        // socket.on('getUserActivityStatus', async ({ userId }) => {
        //     const socketInfo = await UserSocket.findOne({
        //         where: {
        //             userId: userId
        //         }
        //     })
        //     const existingActivity = await UserActivity.findOne({
        //         where: {
        //             userId: userId
        //         }
        //     })

        //     if (socketInfo) {
        //         if (existingActivity) {
        //             io.to(socketInfo.socketId).emit('getUserActivityStatus', { userId: socketInfo.userId, status: existingActivity.status === "online" ? existingActivity.status : existingActivity.updatedAt });
        //         }
        //         else {
        //             io.to(socketInfo.socketId).emit('getUserActivityStatus', { userId: socketInfo.userId, status: "lastseen at 12 pm" });
        //         }

        //     }
        // });

        // Handle start typing event
        socket.on('startTyping', async ({ recieverId }) => {
            const socketInfo = await UserSocket.findOne({
                where: {
                    userId: recieverId
                }
            });
            console.log("socket info = ", socketInfo);
            if (socketInfo) {
                io.to(socketInfo.socketId).emit('userTyping', { userId: socket.userId, typing: true });

            }
        });

        // Handle stop typing event
        socket.on('stopTyping', async ({ recieverId }) => {
            const socketInfo = await UserSocket.findOne({
                where: {
                    userId: recieverId
                }
            });
            console.log("socket info = ", socketInfo);
            if (socketInfo) {
                const currActivity = await UserActivity.findOne({
                    where: {
                        userId: recieverId
                    }
                })
                if (currActivity.status === "Online")
                    io.to(socketInfo.socketId).emit('userTyping', { userId: socket.userId, typing: false, status: currActivity.status });
                else
                    io.to(socketInfo.socketId).emit('userTyping', { userId: socket.userId, typing: false, status: currActivity.updatedAt });
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected');
            if (socket.userId) {
                await UserActivity.update({ status: "Offline" }, {
                    where: {
                        userId: socket.userId
                    }
                });
                const existingActivity = await UserActivity.findOne({
                    where: {
                        userId: socket.userId
                    }
                })
                io.emit('getUserActivityStatus', { userId: socket.userId, status: existingActivity.updatedAt });
            }

        });
    });

    return io;
}

module.exports = initializeSocket;

