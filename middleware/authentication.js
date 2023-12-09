const JWT = require("jsonwebtoken");

exports.createToken = async (userCode, userName) => {
  try {
    const token = JWT.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        data: {
          userCode: userCode,
          userName: userName,
        },
      },
      process.env.SECRET
    );
    return token;
  } catch (error) {
    throw error;
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      res.send({
        statusCode: 401,
        message: "unauthorized",
      });
    var decoded = JWT.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET
    );
    req.payload = decoded.data;
    next();
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    } else {
      return res.status(500).json({ message: "Token verification failed" });
    }
  }
};
