import User from "../../models/user.model.js";

import Response from "../../utils/generateResponse.js";
import { HTTP_STATUS } from "../../constants/enum/responseCodes.enum.js";
import userRole from "../../constants/enum/userRole.enum.js";
import envs from "../../constants/enum/environments.enum.js";

import { NODE_ENV } from "../../config/env.js";

import { generateCandidateToken, generateTrainerToken, generateAdminToken, generateResetPasswordToken, verifyResetPasswordToken } from "../../utils/jwtUtil.js";

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
    
    return Response.success(res, HTTP_STATUS.CREATED, "User registered successfully.", { token });
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

const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Old password and new password are required.");
    }

    const user = await User.findById(id);
    if (!user) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "User does not exist.");
    }

    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "Old password is incorrect.");
    }

    if (oldPassword === newPassword) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "New password cannot be the same as old password.");
    }

    user.password = newPassword;
    await user.save();

    return Response.success(res, HTTP_STATUS.OK, "Password changed successfully.");
  }
  catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};

const sendResetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Email is required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.error(res, HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    const resetToken = generateResetPasswordToken(user._id, user.email);

    // TODO: Send the reset token to the user's email
    // await sendEmail({
    //   to: user.email,
    //   subject: "Password Reset",
    //   text: `Your password reset token is: ${resetToken}`
    // });

    return Response.success(res, HTTP_STATUS.OK, "Password reset link sent to " + user.email.slice(0, 5) + "****. Please check your email.", { resetToken: (NODE_ENV === envs.DEV) ? resetToken : undefined });
  }
  catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Token and new password are required.");
    }

    const decoded = verifyResetPasswordToken(token);

    if (!decoded) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "Invalid or expired reset password token.");
    }

    const user = await User.findById(decoded.id);
    if (!user || user.email !== decoded.email) {
      return Response.error(res, HTTP_STATUS.NOT_FOUND, "User not found.");
    }

    user.password = newPassword;
    await user.save();

    return Response.success(res, HTTP_STATUS.OK, "Password reset successfully.");
  }
  catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};

export { register, login, changePassword, sendResetPasswordLink, resetPassword };