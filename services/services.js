const User = require("../models/userModel");
const Message = require("../models/userMessages");
const Follow = require("../models/follwerFollowingUser");
const authentication = require("../middleware/authentication");
exports.signUp = async (res, userName, password, email) => {
  try {
    const userExist = await User.findOne({
      userName,
      password,
      email,
      isActive: true,
    });

    if (userExist) {
      return res.status(409).json({
        message: "User alread exists.",
      });
    }
    const data = await User.create({
      userName: userName,
      password: password,
      email: email,
    });
    const token = await authentication.createToken(
      data.userCode,
      data.userName
    );
    return res.status(200).json({
      message: "user signup successfull",
      userCode: data.userCode,
      token: token,
    });
  } catch (error) {
    console.log(`Error at signUp process...............`, error);
  }
};

exports.login = async (res, password, email) => {
  try {
    const userExist = await User.findOne(
      { password, email, isActive: true },
      { userName: 1, userCode: 1, _id: 0 }
    );
    if (!userExist) {
      return res.status(300).json({
        message: "User not found",
      });
    } else {
      const token = await authentication.createToken(
        userExist.userCode,
        userExist.userName
      );
      return res.status(200).json({
        message: "User logged successfully",
        data: {
          userId: userExist.userCode,
          token: token,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

exports.followUser = async (res, followinguserCode, followerUserode) => {
  try {
    const userExist = await User.findOne(
      { userCode: followinguserCode, isActive: true },
      { userName: 1, userCode: 1, _id: 0 }
    );
    if (!userExist) {
      return res.status(300).json({
        message: "User not found",
      });
    } else {
      const followCheck = await Follow.findOne({
        followingUserCode: followinguserCode,
        followerUserCode: followerUserode,
      });
      if (followCheck) {
        return res.status(200).json({
          message: "Already following",
        });
      }
      let followerFollowingObj = {
        followerUserCode: followerUserode,
        followingUserCode: followinguserCode,
      };
      let d = await User.updateOne(
        { userCode: followerUserode },
        { $inc: { followingCount: 1 } }
      );
      await User.updateOne(
        { userCode: followinguserCode },
        { $inc: { followerCount: 1 } }
      );

      await Follow.create(followerFollowingObj);
      return res.status(200).json({
        message: "User follwed successfully",
      });
    }
  } catch (error) {
    throw error;
  }
};

exports.tweet = async (res, userCode, tweet) => {
  try {
    const data = await Message.create({ userCode, message: tweet });
    return res.status(200).json({
      message: "tweet uploaded successfully",
      tweet: data.message,
    });
  } catch (error) {
    throw error;
  }
};

exports.getTweets = async (res, userCode) => {
  try {
    console.log(userCode);
    let data = await User.aggregate([
      {
        $match: {
          userCode: userCode,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "followerfollowingusers",
          let: { isActive: true, followerUserCode: "$userCode" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$followerUserCode", "$$followerUserCode"],
                    },
                    {
                      $eq: ["$isActive", "$$isActive"],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$_id",
                followingUserCodes: { $push: "$followingUserCode" },
              },
            },
          ],
          as: "codes",
        },
      },
      {
        $unwind: {
          path: "$codes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $set: {
          followingUserCodes: {
            $cond: {
              if: { $isArray: "$codes.followingUserCodes" },
              then: {
                $concatArrays: ["$codes.followingUserCodes", ["$userCode"]],
              },
              else: ["$userCode"], // If existingArray is not an array or doesn't exist, provide a new array with the ID
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userCodes: "$followingUserCodes",
        },
      },
      {
        $lookup: {
          from: "messages",
          let: {
            userCodes: "$userCodes",
            isActive: true,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: {
                    $in: ["$userCode", "$$userCodes"],
                  },
                },
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $project: {
                _id: 0,
                message: 1,
                userCode: 1,
                messageCode: 1,
              },
            },
          ],
          as: "tweets",
        },
      },
      {
        $project: {
          tweets: "$tweets",
        },
      },
    ]);
    res.status(200).json({
      data: data.length ? data[0].tweets : [],
    });
  } catch (error) {
    throw error;
  }
};
