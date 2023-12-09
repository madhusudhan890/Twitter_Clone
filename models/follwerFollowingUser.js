const mongoose = require("mongoose");

const followerFollowingUserSchema = new mongoose.Schema({
  followerUserCode: {
    type: String,
    default: "N/A",
  },
  followingUserCode: {
    type: String,
    default: "N/A",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const followerFollowingUser = mongoose.model(
  "followerFollowingUser",
  followerFollowingUserSchema
);

module.exports = followerFollowingUser;
