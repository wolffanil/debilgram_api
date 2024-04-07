const MessageService = require("../services/messageService");
const catchAsync = require("../utils/catchAsync");

class MessageController {
  getAllMessages = catchAsync(async (req, res, next) => {
    const params = req.params;

    const messages = await MessageService.getAllMessages({ params });

    res.status(200).json({ messages });
  });

  createNewMessage = catchAsync(async (req, res, next) => {
    const body = req.body;
    const user = req.user;

    const message = await MessageService.createNewMessage({
      body,
      user,
      next,
    });

    res.status(201).json({ message });
  });
}

module.exports = new MessageController();
