import "dotenv/config";
import mongoose from "mongoose";
import { Otp } from "./src/model/otp.model.js";
import { storeOtp, verifyStoredOtp } from "./src/service/otpStore.js";

let failures = 0;
const check = (label, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}: ${label}`);
  if (!cond) failures++;
};

await mongoose.connect(`${process.env.dblink}RideNow`);
await Otp.init(); // wait for index builds (incl. TTL) before asserting on them

const email = "verify.test@example.com";

// 1. store + normalization
await storeOtp("  Verify.Test@Example.COM ", "654321");
let doc = await Otp.findOne({ email });
check("stored doc exists under normalized email", !!doc);
check("otp is hashed (not plaintext)", !!doc && doc.otp !== "654321" && doc.otp.length > 20);
check("expiresAt ~5min ahead", !!doc && doc.expiresAt.getTime() > Date.now() + 4 * 60 * 1000 && doc.expiresAt.getTime() < Date.now() + 6 * 60 * 1000);

// 2. wrong OTP fails, doc kept
check("wrong otp rejected", (await verifyStoredOtp(email, "000000")) === false);
check("doc kept after wrong attempt", !!(await Otp.findOne({ email })));

// 3. correct OTP (different-case email input) succeeds, one-shot
check("correct otp accepted (case-insensitive email)", (await verifyStoredOtp("VERIFY.TEST@example.com", "654321")) === true);
check("doc deleted after successful verify", !(await Otp.findOne({ email })));
check("second verify of same otp fails", (await verifyStoredOtp(email, "654321")) === false);

// 4. regenerate replaces
await storeOtp(email, "111111");
await storeOtp(email, "222222");
check("regenerate replaces previous doc", (await Otp.countDocuments({ email })) === 1);
check("old otp invalid after regenerate", (await verifyStoredOtp(email, "111111")) === false);
check("new otp valid", (await verifyStoredOtp(email, "222222")) === true);

// 5. expiry enforced at verify time
await storeOtp(email, "333333");
await Otp.updateOne({ email }, { expiresAt: new Date(Date.now() - 1000) });
check("expired otp rejected", (await verifyStoredOtp(email, "333333")) === false);
check("expired doc deleted on verify", !(await Otp.findOne({ email })));

// 6. indexes
const indexes = await Otp.collection.indexes();
const ttl = indexes.find((i) => i.key && i.key.expiresAt === 1);
check("TTL index on expiresAt (expireAfterSeconds: 0)", !!ttl && ttl.expireAfterSeconds === 0);
check("email index present", !!indexes.find((i) => i.key && i.key.email === 1));

await mongoose.disconnect();
console.log(failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
