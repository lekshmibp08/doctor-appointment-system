import express from "express";
import { adminController } from "../controllers/AdminController";
import { authController } from "../controllers/AuthController";

const router = express.Router();


// Login route
router.post("/login", adminController.login);

// Doctors Listing
router.get("/doctors", adminController.getDoctors);

// Logout route
router.post("/logout", authController.logout);

export default router;
