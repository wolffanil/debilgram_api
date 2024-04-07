const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const tokenService = require("../services/tokenService");

const protect = catchAsync(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(
      new AppError(
        "Вы не авторизованы! Пожалуйста, войдите, чтобы получить доступ. ",
        401
      )
    );
  }

  const accessToken = authorizationHeader.split(" ")[1];
  if (!accessToken) {
    return next(
      new AppError(
        "Вы не авторизованы! Пожалуйста, войдите, чтобы получить доступ. ",
        401
      )
    );
  }

  const userData = await tokenService.validateAccessToken(accessToken);
  if (!userData) {
    return next(
      new AppError(
        "Вы не авторизованы! Пожалуйста, войдите, чтобы получить доступ. ",
        401
      )
    );
  }

  req.user = userData;
  next();
});

module.exports = protect;
