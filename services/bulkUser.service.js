// /services/bulkUser.service.js
import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js"; // yet implement it

import generatePassword from "../utils/generatePassword.js";

export const bulkCreateCandidates = async (users) => {
  const failed = [];
  const created = [];

  for (let u of users) {
    try {
      const existingUser = await User.findOne({ email: u.email });
      if (existingUser) {
        failed.push({ email: u.email, reason: "User already exists" });
        continue;
      }

      const password = generatePassword(u.name, u.dob);
      // const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: u.name,
        email: u.email,
        phone: u.phone,
        password,
        role: "candidate",
      });

      if (u.group) {
        await Group.findOneAndUpdate(
          { name: u.group },
          { $addToSet: { members: user._id } },
          { upsert: true, new: true }
        );
      }

      await sendEmail({
        to: u.email,
        subject: "🎓 Your Assessment Platform Credentials",
        text: `Hello ${u.name},\n\nYou can now log in to the assessment platform.\n\nEmail: ${u.email}\nPassword: ${password}\n\nPlease change your password after login.\n\nRegards,\nAssessment Team`,
      });

      created.push(user.email);
    } catch (error) {
      failed.push({ email: u.email, reason: error.message });
    }
  }

  return { createdCount: created.length, failed };
};
