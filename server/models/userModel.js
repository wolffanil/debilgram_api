const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const server_url = process.env.SERVER_URL;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, "пожалуйста введите коректный email"],
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      minLength: [6, "Имя должно быть больше чем 5 символов"],
      required: true,
      unique: true,
    },
    username: {
      type: String,
      minLength: [6, "Ник должен быть больше 5 символов"],
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    photoProfile: {
      type: String,
      default: server_url + "/upload/profile/default.svg",
    },
    bio: String,
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = user;
