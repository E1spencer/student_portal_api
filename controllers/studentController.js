import mongoose from "mongoose";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

// CREATE STUDENT (POST)
export const createStudent = async (req, res) => {
  try {
    const { name, registrationNumber, email } = req.body;

    if (!name || !registrationNumber || !email) {
      return res.status(400).json({
        message: "Name, registration number, and email are required"
      });
    }

    const student = await Student.create({
      name,
      registrationNumber,
      email
    });

    res.status(201).json({
      message: "Student account created successfully",
      student: student
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create student account",
      error: error.message
    });
  }
};


// GET STUDENT (GET)
export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findById(id).populate("courses");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      student: student
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve student",
      error: error.message
    });
  }
};

// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("courses");

    res.status(200).json({
      message: "Students retrieved successfully",
      count: students.length,
      students
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve students",
      error: error.message
    });
  }
};

// UPDATE STUDENT (PATCH)
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, registrationNumber, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    if (registrationNumber || email) {
      return res.status(400).json({
        message: "Only the student's name can be updated"
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { name },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student profile updated successfully",
      student: student
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update student profile",
      error: error.message
    });
  }
};


// ADD COURSE TO STUDENT (PATCH)
export const addCourseToStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        message: "Invalid student ID or course ID"
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (student.courses.includes(courseId)) {
      return res.status(400).json({
        message: "Student is already enrolled in this course"
      });
    }

    student.courses.push(courseId);

    await student.save();

    res.status(200).json({
      message: "Course added to student successfully",
      student
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add course to student",
      error: error.message
    });
  }
};

// GET ALL COURSES FOR A SINGLE STUDENT
export const getStudentCourses = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID"
      });
    }

    const student = await Student.findById(id).populate("courses");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student courses retrieved successfully",
      count: student.courses.length,
      courses: student.courses
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve student courses",
      error: error.message
    });
  }
};

// REMOVE COURSE FROM STUDENT
export const removeCourseFromStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        message: "Invalid student ID or course ID"
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    if (!student.courses.includes(courseId)) {
      return res.status(400).json({
        message: "Student is not registered for this course"
      });
    }

    student.courses = student.courses.filter(
      (id) => id.toString() !== courseId
    );

    await student.save();

    res.status(200).json({
      message: "Course removed from student successfully",
      student
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to remove course from student",
      error: error.message
    });
  }
};

// DELETE STUDENT (DELETE)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student account",
      error: error.message
    });
  }
};