# Student Portal API

A RESTful backend API built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose** for managing student accounts and course relationships.

The project started as a CRUD-based Student Portal API where students can create, retrieve, update, and delete their accounts. It has since been extended to support **database relationships and referencing** by allowing students to be associated with courses.

---

## Features

### Student Management

Students can:

* Create an account
* Retrieve their account details
* Update their name
* Delete their account

Each student account contains:

* Name
* Registration Number
* Email Address

Students are only allowed to update their **name**. Their registration number and email address cannot be changed.

### Course Management

The API also supports:

* Creating courses
* Preventing duplicate course codes
* Assigning courses to students

Each course contains:

* Course Code
* Course Title

### Student-Course Relationship

Students can be enrolled in multiple courses.

The project uses **MongoDB ObjectId references** to connect students with courses.

The Student model contains a `courses` array:

```javascript
courses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
]
```

Each value in the array references a document in the `courses` collection.

Mongoose `populate()` is used when retrieving a student so that the API can return full course information instead of only course IDs.

---

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* dotenv
* Nodemon
* Postman

---

## Project Structure

```text
student_portal_api/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── studentController.js
│   └── courseController.js
│
├── models/
│   ├── Student.js
│   └── Course.js
│
├── routes/
│   ├── studentRoutes.js
│   └── courseRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

# API Endpoints

## Student Endpoints

### Create Student

```http
POST /api/students
```

Example request body:

```json
{
  "name": "Jason Derulo",
  "registrationNumber": "ENG124",
  "email": "jason@gmail.com"
}
```

Example successful response:

```json
{
  "message": "Student account created successfully",
  "student": {
    "_id": "student_id",
    "name": "Jason Derulo",
    "registrationNumber": "ENG124",
    "email": "jason@gmail.com",
    "courses": []
  }
}
```

---

### Get Student

```http
GET /api/students/:id
```

Example:

```text
GET /api/students/6a9b3bb309619168bc79c28e
```

The API uses Mongoose `populate()` to return full information about courses assigned to the student.

Example response:

```json
{
  "message": "Student retrieved successfully",
  "student": {
    "_id": "6a9b3bb309619168bc79c28e",
    "name": "Jason Derulo",
    "registrationNumber": "ENG124",
    "email": "jason@gmail.com",
    "courses": [
      {
        "_id": "6a9de3610a2fe920b5de0abb",
        "courseCode": "CPE301",
        "courseTitle": "Computer Networks"
      }
    ]
  }
}
```

---

### Update Student

```http
PATCH /api/students/:id
```

Only the student's name can be updated.

Example request:

```json
{
  "name": "Jason Smith"
}
```

Attempts to update the email address or registration number are rejected.

Example invalid request:

```json
{
  "email": "newemail@gmail.com"
}
```

Example response:

```json
{
  "message": "Only the student's name can be updated"
}
```

---

### Delete Student

```http
DELETE /api/students/:id
```

Example successful response:

```json
{
  "message": "Student account deleted successfully"
}
```

---

## Course Endpoints

### Create Course

```http
POST /api/courses
```

Example request:

```json
{
  "courseCode": "CPE301",
  "courseTitle": "Computer Networks"
}
```

Example response:

```json
{
  "message": "Course created successfully",
  "course": {
    "_id": "course_id",
    "courseCode": "CPE301",
    "courseTitle": "Computer Networks"
  }
}
```

Course codes must be unique.

If a course with the same course code already exists, the API returns a conflict response.

---

## Enroll Student in a Course

```http
PATCH /api/students/:studentId/courses/:courseId
```

Example:

```text
PATCH /api/students/6a9b3bb309619168bc79c28e/courses/6a9de3610a2fe920b5de0abb
```

No request body is required.

Example response:

```json
{
  "message": "Course added to student successfully",
  "student": {
    "_id": "6a9b3bb309619168bc79c28e",
    "name": "Jason Derulo",
    "registrationNumber": "ENG124",
    "email": "jason@gmail.com",
    "courses": [
      "6a9de3610a2fe920b5de0abb"
    ]
  }
}
```

---

# Database Design

The project currently uses two MongoDB collections:

```text
studentPortal
│
├── students
│
└── courses
```

## Student Schema

```javascript
{
  name: String,
  registrationNumber: String,
  email: String,
  courses: [ObjectId]
}
```

## Course Schema

```javascript
{
  courseCode: String,
  courseTitle: String
}
```

---

# Database Relationship

The relationship between students and courses is implemented using **referencing**.

A student stores course IDs:

```json
{
  "name": "Jason Derulo",
  "courses": [
    "6a9de3610a2fe920b5de0abb"
  ]
}
```

The referenced course exists separately:

```json
{
  "_id": "6a9de3610a2fe920b5de0abb",
  "courseCode": "CPE301",
  "courseTitle": "Computer Networks"
}
```

The relationship can be represented as:

```text
Student
   │
   │ references
   ↓
Course
```

Because a student can take multiple courses and a course can be taken by multiple students, this represents a **many-to-many relationship** conceptually.

---

# Mongoose Populate

When retrieving a student, the API uses:

```javascript
Student.findById(id).populate("courses");
```

Instead of returning:

```json
{
  "courses": [
    "6a9de3610a2fe920b5de0abb"
  ]
}
```

Mongoose returns:

```json
{
  "courses": [
    {
      "_id": "6a9de3610a2fe920b5de0abb",
      "courseCode": "CPE301",
      "courseTitle": "Computer Networks"
    }
  ]
}
```

The IDs remain stored in the Student document. `populate()` only replaces the references with the corresponding documents when returning the result.

---

# Validation and Error Handling

The API includes validation for:

* Missing student information
* Invalid MongoDB ObjectIds
* Students that do not exist
* Courses that do not exist
* Duplicate course codes
* Duplicate student-course enrollment
* Attempts to update restricted student fields

Common HTTP status codes used include:

| Status Code | Meaning                        |
| ----------- | ------------------------------ |
| `200`       | Request successful             |
| `201`       | Resource created successfully  |
| `400`       | Invalid request                |
| `404`       | Resource not found             |
| `409`       | Duplicate/conflicting resource |
| `500`       | Internal server error          |

---

# CRUD Operations

The Student API implements the four main CRUD operations:

| CRUD   | HTTP Method | Operation           |
| ------ | ----------- | ------------------- |
| Create | POST        | Create student      |
| Read   | GET         | Retrieve student    |
| Update | PATCH       | Update student name |
| Delete | DELETE      | Delete student      |

---

# Learning Objectives

This project demonstrates practical knowledge of:

* REST APIs
* Node.js
* Express routing
* Controllers
* MongoDB Atlas
* Mongoose schemas and models
* CRUD operations
* Environment variables
* HTTP status codes
* Request validation
* Error handling
* MongoDB ObjectIds
* Database relationships
* Document referencing
* Many-to-many relationships
* Mongoose `populate()`

---

# Future Improvements

Possible improvements include:

* Retrieve all students
* Retrieve all courses
* Remove a course from a student
* Retrieve all students enrolled in a course
* Authentication and authorization
* Password hashing
* JWT authentication
* Student login
* Course enrollment limits
* Improved email validation
* Custom student IDs
* API documentation with Swagger/OpenAPI

---

## Author

**Elshaddai**

Backend Development Learning Project
