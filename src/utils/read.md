const { Server } = require("socket.io");
const Chat = require("../models/chatmodel");

const createSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("join room", ({ userId, targetId }) => {
      const room = [userId, targetId].sort().join("_");
      socket.join(room);
    });

    socket.on("chat message", async ({ userId, targetId, msg }) => {
      try {
        const room = [userId, targetId].sort().join("_");

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages: [],
          });
        }
        chat.messages.push({
            send
        })
        io.to(room).emit("recived message", { msg, userId });
      } catch (error) {}
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};

module.exports = createSocket;
