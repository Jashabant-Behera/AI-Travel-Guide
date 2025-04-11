import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User not found, please Signup.",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode.id) {
      req.body.userId = decode.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in again.",
    });
  }
};

export default verifyToken;
