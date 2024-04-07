const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const AppError = require("../utils/AppError");

class ChatService {
  async accessChat({ user, userId }) {
    const existChat = await this.existChat({ user, userId });

    if (existChat.length > 0) return existChat[0];

    return this.createNewChat({ user, userId });
  }

  async createNewChat({ user, userId }) {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [user.id, userId],
      background: "",
    });

    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      this.returnCurrentUserData()
    );

    return FullChat;
  }

  async existChat({ user, userId }) {
    console.log(user, userId);

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .lean()
      .populate("users", this.returnCurrentUserData())
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: this.returnCurrentUserData(),
    });

    return isChat;
  }

  async getMyChats({ user }) {
    let chats = await Chat.find({ users: { $elemMatch: { $eq: user.id } } })
      .populate("users", this.returnCurrentUserData())
      .populate("groupAdmin", this.returnCurrentUserData())
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .lean();

    chats = User.populate(chats, {
      path: "latestMessage.sender",
      select: this.returnCurrentUserData(),
    });

    return chats;
  }

  async createGroupChat({ body, user, next }) {
    const { clients, name } = body;

    if (!clients || !name)
      return next(new AppError("Пожалуйста заполните все поля", 400));

    let users = JSON.parse(clients);

    if (users.length < 2) {
      return next(new AppError("Должно быть больше 2 участиков", 400));
    }

    users.push(user.id);

    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: user.id,
    });

    const fullGropChat = await Chat.findById(groupChat._id)
      .populate("users", this.returnCurrentUserData())
      .populate("groupAdmin", this.returnCurrentUserData());

    return fullGropChat;
  }

  async addToGroup({ params, next }) {
    const { chatId, userId } = params;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    );

    if (!added) return next(new AppError("Чат не был найден", 404));

    return added;
  }

  async changeDataGroup({ params, body, next }) {
    const { chatId } = params;
    const { chatName, background } = body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
        background,
      },
      {
        new: true,
      }
    );

    if (!updatedChat) return next(new AppError("Чат не был найден", 404));

    return updatedChat;
  }

  async removeFromGroup({ params, next }) {
    const { chatId, userId } = body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    );

    if (!removed) return next(new AppError("Чат не бал найден", 404));

    return removed;
  }

  returnCurrentUserData() {
    const str = "_id name username email photoProfile";

    return str;
  }
}

module.exports = new ChatService();
