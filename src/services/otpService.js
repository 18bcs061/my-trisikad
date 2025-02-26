// services/otpService.js
const OTPModel = require('../Models/OTP');
const crypto = require('crypto');

async function generateOTP(phoneNumber) {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await OTPModel.create({ phoneNumber, otp, expiresAt });

  // TODO: send SMS via Twilio, etc.
  // e.g. sendSMS(phoneNumber, `Your OTP is ${otp}, valid for 5 minutes`);
}

async function verifyOTP(phoneNumber, inputOTP) {
  const record = await OTPModel.findOne({ phoneNumber }).sort({ createdAt: -1 });
  if (!record) return false;
  if (new Date() > record.expiresAt) return false;
  return record.otp === inputOTP;
}

module.exports = { generateOTP, verifyOTP };
