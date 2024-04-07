const UserService = require("../services/userService");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

class UserController {
  getAllUsers = catchAsync(async (req, res, next) => {
    const user = req.user;
    const users = await UserService.getAllUsers({ query: req.query, user });

    res.status(200).json({ users });
  });

  updateMyProfile = catchAsync(async (req, res, next) => {
    const user = req.user;

    const profile = await UserService.updateMyProfile({
      body: req.body,
      user,
      next,
    });

    res.status(200).json({ profile });
  });

  getMyTokens = catchAsync(async (req, res, next) => {
    const user = req.user;

    const tokens = await UserService.getMyTokens({ user });

    res.status(200).json({ tokens });
  });

  getUserById = catchAsync(async (req, res, next) => {
    const id = req.params.id;

    if (!id) return next(new AppError("Id пользователя должен быть", 400));

    const user = await UserService.getUserById({ id });

    res.status(200).json({ user });
  });

  deleteToken = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = req.user;

    if (!id) return next(new AppError("Id токена должен быть", 400));

    const status = await UserService.deleteToken({ id, user, next });

    res.status(200).json(status);
  });
}

module.exports = new UserController();
