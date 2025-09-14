import { Router } from "express";
import {
  registerStudent,
  loginStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Protected routes
router.get("/students", authMiddleware, getStudents);
router.get("/student/:id", authMiddleware, getStudentById);
router.put("/student/:id", authMiddleware, updateStudent);
router.delete("/student/:id", authMiddleware, deleteStudent);

export default router;
