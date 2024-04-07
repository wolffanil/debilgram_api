const Token = require("../models/tokenModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

class UserService {
  async getAllUsers({ query, user }) {
    if (query.q && query.q?.length > 2)
      return this.getSortUsers({ query, user });

    let users = await User.find()
      .select(this.returnCurrentData())
      .sort({ createdAt: -1 })
      .lean();

    users = users.map((user) => ({ ...user, id: user._id, _id: undefined }));

    return users;
  }

  async getSortUsers({ query, user }) {
    const regex = new RegExp(query.q, "i");

    const users = await User.find({
      _id: { $ne: user.id },
      $or: [
        { email: { $regex: regex } },
        { name: { $regex: regex } },
        { username: { $regex: regex } },
      ],
    })
      .select(this.returnCurrentData())
      .sort({ createAt: -1 })
      .lean();

    return users;
  }

  async updateMyProfile({ body, user, next }) {
    const { bio, name, username, photoProfile } = body;

    if (!user.name === name) {
      const existName = await User.findOne({ name }).lean();

      if (existName)
        return next(
          new AppError("Пользователь с таким именем уже существует", 400)
        );
    }

    const profile = await User.findByIdAndUpdate(
      user.id,
      { bio, name, username, photoProfile },
      { new: true, runValidators: true }
    )
      .select(this.returnCurrentData())
      .lean();

    if (!profile) return next(new AppError("Пользователь не был найден", 404));

    return profile;
  }

  async getMyTokens({ user }) {
    const tokens = await Token.find({ userId: user.id })
      .sort({ updatedAt: -1 })
      .lean();

    return tokens;
  }

  async getUserById({ id }) {
    const user = await User.findById(id)
      .select(this.returnCurrentData())
      .lean();

    return user;
  }

  async deleteToken({ id, user, next }) {
    const token = await Token.findOneAndDelete({
      _id: id,
      userId: user.id,
    }).lean();

    if (!token) return next(new AppError("Токен не был найден", 404));

    return { status: "success" };
  }

  returnCurrentData() {
    const str = "id email bio name username isOnline photoProfile createdAt";
    return str;
  }
}

module.exports = new UserService();
