import User from "../../models/user.model.js";

import Response from "../../utils/generateResponse.js";
import { HTTP_STATUS } from "../../constants/enum/responseCodes.enum.js";
import userRole from "../../constants/enum/userRole.enum.js";

import { generateCandidateToken, generateTrainerToken, generateAdminToken } from "../../utils/jwtUtil.js";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "name, email, password and role are required.");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "User already exists.");
    }

    const user = await User.create({ name, email, password, role });

    if (!user) {
      return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error creating user.");
    }

    let token;

    if (role == userRole.CANDIDATE) {
      token = generateCandidateToken(user._id, "1d");
    } 
    else if (role == userRole.TRAINER) {
      token = generateTrainerToken(user._id, "1d");
    }
    else if (role == userRole.ADMIN) {
      token = generateAdminToken(user._id, "1d");
    }

    if (!token) {
      return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, `Error generating token for ${role}`);
    }
    
    return Response.success(res, HTTP_STATUS.CREATED, "User registered successfully.", token);
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "Email not found.");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "Invalid credentials.");
    }

    let token;

    if (user.role === userRole.CANDIDATE) {
      token = generateCandidateToken(user._id, "1d");
    }
    else if (user.role === userRole.TRAINER) {
      token = generateTrainerToken(user._id, "1d");
    }
    else if (user.role === userRole.ADMIN) {
      token = generateAdminToken(user._id, "1d");
    }

    return Response.success(res, HTTP_STATUS.OK, "Successfully logged in.", { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};


export { register, login };