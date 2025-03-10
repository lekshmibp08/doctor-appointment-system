import { IOtpRepository } from "../../../domain/repositories/IOtpRepository";
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Doctor } from "../../../domain/entities/Doctor";
import bcrypt from "bcrypt";

export const verifyOtpAndRegisterDoc = async (
  otpRepository: IOtpRepository,
  userRepository: IDoctorRepository,
  data: { email: string; otp: string; fullName: string; mobileNumber: string; registerNumber: string; password: string }
): Promise<Doctor> => {
  const { email, otp, fullName, mobileNumber, registerNumber, password } = data;

  // Check OTP validity
  const otpEntity = await otpRepository.findOtp(email, otp);
  if (!otpEntity || new Date() > otpEntity.expiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  await otpRepository.deleteOtp(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const doctor: Doctor = { fullName, email, mobileNumber, registerNumber, password: hashedPassword, role: "doctor", isApproved: false, isBlocked: false };
  return await userRepository.create(doctor);
};
