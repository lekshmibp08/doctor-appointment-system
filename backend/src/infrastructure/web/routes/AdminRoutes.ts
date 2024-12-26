import express from "express";
import { adminController } from "../controllers/AdminController";
import { authController } from "../controllers/AuthController";
import { authenticateUser } from "../../middlewares/AuthMiddleware";

const router = express.Router();


// Login route
router.post("/login", adminController.login);

// Doctors Listing
router.get("/doctors", authenticateUser(["admin"]), adminController.getDoctors);

//Doctor Approval
router.patch("/doctors/approve/:id", authenticateUser(["admin"]), adminController.doctorApproval);

//Block and unblock Doctor
router.patch("/doctors/block/:id", authenticateUser(["admin"]), adminController.blockAndUnblockDoctor);

// Users Listing
router.get("/users", authenticateUser(["admin"]), adminController.getAllUsers);

//Block and unblock User
router.patch("/users/block/:id", authenticateUser(["admin"]), adminController.blockAndUnblockUser);

// Logout route
router.post("/logout", authController.logout);

export default router;
