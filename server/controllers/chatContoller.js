const ChatService = require("../services/ChatService");
const catchAsync = require("../utils/catchAsync");

class ChatController {
  accessChat = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const user = req.user;

    const chat = await ChatService.accessChat({ user, userId });

    res.status(200).json({ chat });
  });

  getMyChats = catchAsync(async (req, res, next) => {
    const user = req.user;

    const chats = await ChatService.getMyChats({ user });

    res.status(200).json({ chats });
  });

  createGroupChat = catchAsync(async (req, res, next) => {
    const user = req.user;
    const body = req.body;

    const chat = await ChatService.createGroupChat({ body, user, next });

    res.status(201).json({ chat });
  });

  addToGroup = catchAsync(async (req, res, next) => {
    const body = req.body;

    const chat = await ChatService.addToGroup({ body, next });

    res.status(200).json({ chat });
  });

  removeFromGroup = catchAsync(async (req, res, next) => {
    const body = req.body;

    const chat = await ChatService.removeFromGroup({ body, next });

    res.status(200).json({ chat });
  });

  changeDataGroup = catchAsync(async (req, res, next) => {
    const params = req.params;
    const body = req.body;

    const chat = await ChatService.changeDataGroup({ params, body, next });

    res.status(200).json({ chat });
  });
}

module.exports = new ChatController();
