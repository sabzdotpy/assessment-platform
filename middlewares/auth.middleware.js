import jwt from "jsonwebtoken";

import Response from "../utils/generateResponse.js";

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // return res.status(401).json({ message: "Unauthorized: Token missing" });
      return Response.error(res, 401, "Unauthorized: Token missing");
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        // return res.status(403).json({ message: "Forbidden: Access denied" });
        return Response.error(res, 403, "Forbidden: Access denied.");
      }
      next();
    } catch (err) {
      // return res.status(401).json({ message: "Invalid token" });
      return Response.error(res, 401, "Invalid Token");
    }
  };
};

export default authMiddleware;
