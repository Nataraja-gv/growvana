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
    // console.log("New user connected:", socket.id);

    socket.on("join room", ({ userId, targetId }) => {
      const roomId = [userId, targetId].sort().join("_");
      socket.join(roomId);
    });
    try {
      socket.on("chat message", async ({ userId, targetId, text }) => {
        const roomId = [userId, targetId].sort().join("_");
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
          sender: userId,
          text,
        });

        await chat.save();

        io.to(roomId).emit("recived message", { text, userId });
      });
    } catch (error) {
      console.log(error?.message);
    }

    socket.on("disconnect", () => {
      // console.log("disconnected");
    });
  });
};

module.exports = createSocket;
