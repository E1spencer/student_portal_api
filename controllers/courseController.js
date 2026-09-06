import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const { courseCode, courseTitle } = req.body;

    if (!courseCode || !courseTitle) {
      return res.status(400).json({
        message: "Course code and course title are required"
      });
    }

    const course = await Course.create({
      courseCode,
      courseTitle
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