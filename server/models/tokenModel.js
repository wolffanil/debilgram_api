const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      index: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      //   required: true,
    },
    device: {
      type: String,
      //   required: true,
    },
    ip: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);

module.exports = Token;
