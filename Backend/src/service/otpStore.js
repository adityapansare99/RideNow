import bcrypt from "bcrypt";
import { Otp } from "../model/otp.model.js";

const OTP_EXPIRY_MS = 5 * 60 * 1000;

const normalizeEmail = (email) => email.toString().trim().toLowerCase();

const storeOtp = async (email, otp) => {
  const normalized = normalizeEmail(email);
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);

  await Otp.deleteMany({ email: normalized });

  await Otp.create({
    email: normalized,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });
};

const verifyStoredOtp = async (email, userOtp) => {
  const normalized = normalizeEmail(email);

  const record = await Otp.findOne({ email: normalized }).sort({
    createdAt: -1,
  });

  if (!record) return false;

  if (Date.now() > record.expiresAt.getTime()) {
    await Otp.deleteOne({ _id: record._id });
    return false;
  }

  const isValid = await bcrypt.compare(userOtp.toString(), record.otp);

  if (!isValid) return false;

  await Otp.deleteOne({ _id: record._id });
  return true;
};

export { storeOtp, verifyStoredOtp };
