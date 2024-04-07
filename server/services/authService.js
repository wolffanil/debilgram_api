const User = require("../models/userModel");
const tokenService = require("./tokenService");
const AppError = require("../utils/AppError");

class AuthService {
  async registration({ name, email, password, ip, fingerprint, next }) {
    const candidate = await User.findOne({ $or: [{ email }, { name }] });

    if (candidate) {
      return next(
        new AppError(
          `Пользователь с почтовым адресом ${email} или именнем ${name} уже существует `,
          404
        )
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const tokens = tokenService.generateTokens({
      id: user._id,
      name: user.name,
    });

    const session = await tokenService.saveToken(
      user._id,
      tokens.refreshToken,
      fingerprint,
      ip
    );

    const userData = this.returnUserData(user);

    return { ...tokens, userData, session };
  }

  async login({ email, password, ip, fingerprint, next }) {
    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Логин или пароль не верны", 404));
    }

    const tokens = tokenService.generateTokens({
      id: user._id,
      name: user.name,
    });

    const session = await tokenService.saveToken(
      user._id,
      tokens.refreshToken,
      fingerprint,
      ip
    );

    user.isOnline = true;
    await user.save();

    const userData = this.returnUserData(user);

    return { ...tokens, userData, session };
  }

  async logout(refreshToken, user) {
    await User.findByIdAndUpdate(user.id, { isOnline: false });
    await tokenService.removeToken(refreshToken);
  }

  async refresh({ refreshToken, fingerprint, body, next }) {
    if (!refreshToken) {
      return next(new AppError("ошибка в токене", 404));
    }

    const { ip } = body;

    const userData = await tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken({
      refreshToken,
      hash: fingerprint.hash,
    });

    if (!userData || !tokenFromDb) {
      return next(
        new AppError("ошибка защиты, пожалуйста авторизируйтесь ещё раз", 404)
      );
    }
    const user = await User.findById(userData.id).lean();

    const tokens = tokenService.generateTokens({
      id: user._id,
      name: user.name,
    });

    await tokenService.removeToken(refreshToken);

    const session = await tokenService.saveToken(
      user._id,
      tokens.refreshToken,
      fingerprint,
      ip
    );

    const userClean = this.returnUserData(user);
    return { ...tokens, userClean, session };
  }

  returnUserData(userData) {
    return {
      id: userData.id || userData._id,
      name: userData.name,
      email: userData.email,
      photoProfile: userData.photoProfile,
      username: userData?.username || "",
      bio: userData?.bio || "",
      isOnline: userData.isOnline,
    };
  }
}

module.exports = new AuthService();
