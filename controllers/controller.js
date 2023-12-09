const Services = require("../services/services");

exports.signUp = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const response = await Services.signUp(res, userName, password, email);
    return response;
  } catch (error) {
    throw error;
  }
};

exports.login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const response = await Services.login(res, password, email);
    return response;
  } catch (error) {
    throw error;
  }
};

exports.followUser = async (req, res) => {
  try {
    const { followinguserCode } = req.body;
    const { userCode } = req.payload;

    const response = await Services.followUser(
      res,
      followinguserCode,
      userCode
    );
    return response;
  } catch (error) {
    throw error;
  }
};

exports.tweet = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const { tweet } = req.body;
    const response = await Services.tweet(res, userCode, tweet);
    return response;
  } catch (error) {
    throw error;
  }
};

exports.getTweets = async (req, res) => {
  try {
    const { userCode } = req.payload;
    const response = await Services.getTweets(res, userCode);
    return response;
  } catch (error) {
    throw error;
  }
};
