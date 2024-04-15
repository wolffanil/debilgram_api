const app = require("./index.js");
const User = require("./models/userModel.js");
const connectToDatabase = require("./config/dbConnect.js");

connectToDatabase();

const port = process.env.PORT || 4000;

const server = app.listen(port, console.log(`server working on port ${port}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000 * 10,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", ({ userData, sessionId }) => {
    socket.join(userData.id);
    socket.in(userData.id).emit("signin", sessionId);
  });

  socket.on("online", ({ users, id }) => {
    users.forEach((user) => {
      if (user._id === id) return;
      socket.in(user._id).emit("online", id);
    });
  });

  socket.on("offline", ({ users, id }) => {
    users.forEach((user) => {
      if (user._id === id) return;
      socket.in(user._id).emit("offline", id);
    });

    const handleOffline = async () => {
      await User.findByIdAndUpdate(id, { isOnline: false });
    };

    handleOffline();
  });

  socket.on("deleteDevice", ({ myId, sessionId }) => {
    socket.in(myId).emit("deleteMyDevice", sessionId);
  });

  socket.on("new message", ({ newMessage, chat }) => {
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;

      socket
        .in(user._id)
        .emit("message recieved", { chatId: chat._id, message: newMessage });
    });
  });

  socket.on("createGroup", ({ users, chatName, groupAdmin }) => {
    console.log(users, "USER");
    console.log(groupAdmin, "GORUP");
    console.log(chatName, "Name");

    if (!users) return;
    users.forEach((user) => {
      if (user === groupAdmin) return;
      socket.in(user).emit("createGroup", chatName);
    });
  });

  socket.on("addToGroup", ({ userId, chatName }) => {
    socket.in(userId).emit("addToGroup", chatName);
  });

  socket.on("removeFromGroup", ({ userId, chatId, chatName }) => {
    if (!chatId) return;
    socket.in(userId).emit("removeFromGroup", { chatId, chatName });
  });

  socket.on("leaveRoom", (id) => {
    socket.leave(id);
  });
});
