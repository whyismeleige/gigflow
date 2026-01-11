const { decodeAccessToken } = require("../utils/auth.utils");
const User = require("../models").user;
const redisClient = require("../database/redis");
const { AuthenticationError } = require("../utils/error.utils");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw AuthenticationError("Session Token required");
  }

  try {
    const { id } = decodeAccessToken(token);

    let user = await redisClient.get(id);

    if (!user) {
      user = await User.findById(id);
      await redisClient.setEx(id, 300, JSON.stringify(user));
    } else {
      user = User.hydrate(JSON.parse(user));
    }

    if (!user) {
      await redisClient.del(id);
      return res.status(400).send({
        message: "User Not Found",
        type: "error",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(403).send({
      message: "Unauthorized Access",
      type: "error",
    });
  }
};