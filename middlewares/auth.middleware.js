import jwt from "jsonwebtoken";

import Response from "../utils/generateResponse.js";
import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Token missing");
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return Response.error(res, HTTP_STATUS.FORBIDDEN, "Forbidden: Access denied.");
      }
      next();
    } catch (err) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "Invalid Token");
    }
  };
};

export default authMiddleware;
