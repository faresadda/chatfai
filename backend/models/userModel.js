const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, "Too short first name"],
      maxlength: [32, "Too long first name"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Too short password"],
    },
    token: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    verificationCode: {
      type: Number,
      required: true,
    },
    chats: {
      type: [
        {
          user: String,
          ai: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema, "users");
