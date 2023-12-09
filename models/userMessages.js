const mongoose = require("mongoose");
const uuid = require("uuid");

const Messagechema = new mongoose.Schema(
  {
    messageCode: {
      type: String,
      unique: true,
      default: function genUUID() {
        return uuid.v1();
      },
    },
    userCode: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", Messagechema);
