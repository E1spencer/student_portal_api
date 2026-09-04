import express from "express";

import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", createStudent);

router.get("/:id", getStudent);

router.patch("/:id", updateStudent);

router.delete("/:id", deleteStudent);

export default router;