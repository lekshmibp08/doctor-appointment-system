import { Otp } from '../entities/Otp'

export type IOtpRepository = {
    saveOtp: (otp: Otp) => Promise<void>;
    findOtp: (email: string, otp: string) => Promise<Otp | null>;
    deleteOtp: (email: string) => Promise<void>;
  };
  