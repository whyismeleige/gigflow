const { verifyToken } = require("../utils/auth.utils");
const { AuthenticationError } = require("../utils/error.utils");
const User = require("../models").user;

exports.authenticateToken = async (req, res, next) => {
  try {
    // Extract token from cookie (not from Authorization header)
    const token = req.cookies.token;

    if (!token) {
      throw new AuthenticationError("Authentication required. Please login");
    }

    // Verify JWT token
    const { id } = verifyToken(token);

    // Find user from decoded token
    const user = await User.findById(id);

    if (!user) {
      throw new AuthenticationError("User not found. Please login again");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AuthenticationError("Invalid token. Please login again"));
    }
    if (error.name === "TokenExpiredError") {
      return next(
        new AuthenticationError("Session expired. Please login again")
      );
    }
    next(error);
  }
};
