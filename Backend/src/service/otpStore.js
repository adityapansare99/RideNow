import bcrypt from "bcrypt";

const otpStore = new Map(); 

const storeOtp = async (mobile, otp) => {
  const hashedOtp = await bcrypt.hash(otp.toString(), 10);

  otpStore.set(mobile, {
    otp: hashedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000, 
  });
};

const verifyStoredOtp = async (mobile, userOtp) => {
  const record = otpStore.get(mobile);

  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }

  const isValid = await bcrypt.compare(
    userOtp.toString(),
    record.otp
  );

  if (!isValid) return false;

  otpStore.delete(mobile);
  return true;
};

export {storeOtp,verifyStoredOtp};