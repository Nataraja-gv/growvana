const Chat = require("../models/chatmodel");

const getusersChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.query.targetId;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] },
    }).populate({
      path: "messages.sender",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetId],
        messages: [],
      });
    }

    res.status(200).json({ message: "user chat details", data: chat });
  } catch (error) {
    console.log(error.message);
  }
};

const getAdminChats = async (req, res) => {
  try {
    const userId = req.admin._id;
    const targetId = req.query.targetId;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] },
    }).populate({
      path: "messages.sender",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetId],
        messages: [],
      });
    }

    res.status(200).json({ message: "user chat details", data: chat });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getusersChats, getAdminChats };
