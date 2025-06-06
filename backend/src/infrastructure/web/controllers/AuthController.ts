import { Request, Response } from "express";
import { googleOAuthLogin } from "../../../application/useCases/auth/googleOAuthLogin";
import jwt from "jsonwebtoken";


export const authController = {
  // Logout for all roles (User, Doctor, Admin)
  logout: (req: Request, res: Response): void => {
    try {
      const { role } = req.body;
      let cookieName = "";
      if (role === "user") {
        cookieName = "user_refresh_token";
      } else if (role === "doctor") {
        cookieName = "doctor_refresh_token";
      } else {
        cookieName = "admin_refresh_token";
      } 
      
      // Clear the auth token cookie
      res.clearCookie(cookieName, { httpOnly: true });
      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Error during logout", error: error.message });
    }
  },

  googleLogin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullname, email, role, profilePicture } = req.body;      
      

      if (!email || !role) {
        res.status(400).json({ message: "Authentication failed" });
        return;
      }

      const { token, refreshToken, role: userRole, user } = await googleOAuthLogin(fullname, email, profilePicture, role);   

      const userData = user._doc;

      if(role === 'user') {
        res.cookie("user_refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ token, userData, role: userRole });

      }
      if(role === 'doctor') {
        res.cookie("doctor_refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ token, userData, role: userRole });
      }  

    } catch (error: any) {
      console.error("Google OAuth Error:", error);
      res.status(500).json({ message: error.message || "Google OAuth login failed" });
    }
  },

  refreshAccessToken: async (req: Request, res: Response): Promise<any> => {
    console.log("Cookies received:", req.cookies);
    console.log("Request Headers:", req.headers);

    //const { refresh_token } = req.cookies;
    const { role } = req.body;
    
      // Get the refresh token for the appropriate role from the cookies
      let refresh_token;
      if (role === 'user') {
        refresh_token = req.cookies['user_refresh_token'];  // For user
      } else if (role === 'doctor') {
        refresh_token = req.cookies['doctor_refresh_token'];  // For doctor
      } else if (role === 'admin') {
        refresh_token = req.cookies['admin_refresh_token'];  // For admin
      } else {
        return res.status(400).json({ message: "Invalid role" });
      }
    
    if (!refresh_token) {
      return res.status(403).json({ message: "Refresh token not found" });
    }
  
    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;      
  
      // Use decoded token properties directly
      const { id, email, role } = decoded;
  
      if (!id || !email || !role) {
        throw new Error("Invalid token payload");
      }
  
      const newAccessToken = jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" } 
      );
  
      return res.status(200).json({ token: newAccessToken });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
  },
};
