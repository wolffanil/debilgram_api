const Message = require("../models/MessageModel");
const Chat = require("../models/chatModel");
const AppError = require("../utils/AppError");

class MessageService {
  async getAllMessages({ params }) {
    const { chatId } = params;

    const messages = await Message.find({ chat: chatId }).lean();

    return messages;
  }

  async createNewMessage({ body, user, next }) {
    const { chatId, content } = body;

    if (!content || !chatId) return next(new AppError("Неверные данные", 400));

    const message = await Message.create({
      sender: user.id,
      content,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    return message;
  }
}

module.exports = new MessageService();
