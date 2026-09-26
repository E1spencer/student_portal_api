import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Student from "../models/Student.js";

//CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { courseCode, courseTitle } = req.body;

    if (!courseCode || !courseTitle) {
      return res.status(400).json({
        message: "Course code and course title are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Course image is required...please upload an image for the course"
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "courses"
    });

    const course = await Course.create({
      courseCode,
      courseTitle,
      courseImage: result.secure_url //uncommited change to store the image URL in the database 
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A course with this course code already exists"
      });
    }

    res.status(500).json({
      message: "Failed to create course",
      error: error.message
    });
  }
};

//GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve courses",
      error: error.message
    });
  }
};

//GET ONE COURSE BY ID
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({
      message: "Course retrieved successfully",
      course
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve course",
      error: error.message
    });
  }
};

//UPDATE COURSE TITLE AND COURSE IMAGE
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseTitle, courseCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    if (courseCode) {
      return res.status(400).json({
        message: "Course code cannot be updated"
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (courseTitle) {
      course.courseTitle = courseTitle;
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "courses"
      });

      course.courseImage = result.secure_url;
    }

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update course",
      error: error.message
    });
  }
};

//DELETE COURSE FROM STUDENTS DATABASE
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    await Student.updateMany(
      { courses: id },
      { $pull: { courses: id } }
    );

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message
    });
  }
};