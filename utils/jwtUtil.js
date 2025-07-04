// add the jwt sign and verify logic here
// and use it wherever needed

import jwt from "jsonwebtoken";

import userRole from "../constants/enum/userRole.enum.js";

const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );
}

const generateCandidateToken = (candidateID, expiresIn = "1d") => {
  return jwt.sign(
    { id: candidateID, role: userRole.CANDIDATE },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

const generateTrainerToken = (trainerID, expiresIn = "1d") => {
  return jwt.sign(
    { id: trainerID, role: userRole.TRAINER },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

const generateAdminToken = (adminID, expiresIn = "1d") => {
  return jwt.sign(
    { id: adminID, role: userRole.ADMIN },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

const generateResetPasswordToken = (userID, userEmail, expiresIn = "30m") => {
  return jwt.sign(
    { id: userID, email: userEmail, action: "reset_password" },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

const verifyResetPasswordToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.action !== "reset_password") {
        return null;
    }

    return decoded;
  }
  catch (error) {
    return null;
  }
    
};

// Not handling errors here, routes should handle errors
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const decodeToken = (token) => {
    return jwt.decode(token);
};

export { generateToken, verifyToken, decodeToken, generateCandidateToken, generateTrainerToken, generateAdminToken, generateResetPasswordToken, verifyResetPasswordToken };