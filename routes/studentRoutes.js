import express from "express";

import {
  createStudent,
  getAllStudents,
  getStudent,
  getStudentCourses,
  updateStudent,
  deleteStudent,
  addCourseToStudent,
  removeCourseFromStudent
} from "../controllers/studentController.js";


const router = express.Router();

router.post("/", createStudent);

router.get("/", getAllStudents);

router.get("/:id/courses", getStudentCourses);

router.get("/:id", getStudent);

router.patch("/:id", updateStudent);

router.delete("/:id", deleteStudent);

router.patch(
  "/:studentId/courses/:courseId",
  addCourseToStudent
);

router.delete(
  "/:studentId/courses/:courseId",
  removeCourseFromStudent
);

export default router;