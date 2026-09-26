import express from "express";
import { 
  createCourse, 
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse 
} from "../controllers/courseController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createCourse);

router.get("/", getAllCourses);

router.get("/:id", getCourse);

router.patch(
  "/:id",
  upload.single("image"),
  updateCourse
);

router.delete("/:id", deleteCourse);

export default router;