# Student Portal API

A RESTful backend API built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose** for managing students, courses, course registration, and course images.

The project supports full CRUD operations for students and courses, student-course relationships using MongoDB references, image uploads using Multer and Cloudinary, validation, and centralized error handling.

---

## Features

### Student Features

Students can:

- Create an account
- Retrieve all students
- Retrieve a single student
- Update their name
- Delete their account
- Register for a course
- Remove a registered course
- Retrieve all courses registered by a specific student

Each student contains:

- Name
- Registration Number
- Email Address
- Registered Courses

Students are only allowed to update their **name**. Their registration number and email address remain unchanged.

---

### Course Features

The API supports:

- Create a course
- Retrieve all available courses
- Retrieve a single course
- Update a course title
- Update a course image
- Delete a course
- Prevent duplicate course codes
- Upload course images
- Store course images using Cloudinary

Each course contains:

- Course Code
- Course Title
- Course Image

Course codes are treated as stable identifiers and cannot be updated.

---

## Student-Course Relationship

Students can register for multiple courses.

The `Student` model stores course references using MongoDB ObjectIds:

```javascript
courses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
]
```

This creates a relationship between students and courses.

For example:

```text
Student
   │
   ├── Course ObjectId
   ├── Course ObjectId
   └── Course ObjectId
          │
          ▼
        Course
```

Mongoose `populate()` is used when retrieving student information so that full course details can be returned instead of only ObjectIds.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer
- Cloudinary
- dotenv
- Nodemon
- Postman

---

## Project Structure

```text
student_portal_api/
│
├── config/
│   ├── cloudinary.js
│   ├── database.js
│   └── multer.js
│
├── controllers/
│   ├── courseController.js
│   └── studentController.js
│
├── models/
│   ├── Course.js
│   └── Student.js
│
├── routes/
│   ├── courseRoutes.js
│   └── studentRoutes.js
│
├── uploads/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGO_URL=your_mongodb_atlas_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not upload `.env` to GitHub.

Your `.gitignore` should contain:

```text
node_modules/
.env
uploads/
```

---

## Installation

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Enter the project directory

```bash
cd student_portal_api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The API should run on:

```text
http://localhost:8000
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

---

### Get All Students

```http
GET /api/students
```

Returns all students in the database.

Registered courses can also be populated in the response.

---

### Get One Student

```http
GET /api/students/:id
```

Example:

```text
GET /api/students/6a9b3bb309619168bc79c28e
```

Returns the student and their populated course information.

---

### Update Student

```http
PATCH /api/students/:id
```

Only the student's name can be updated.

Example:

```json
{
  "name": "Jason Smith"
}
```

Attempts to update the email address or registration number are rejected.

---

### Delete Student

```http
DELETE /api/students/:id
```

Deletes the student account permanently.

---

### Get Student Courses

```http
GET /api/students/:id/courses
```

Returns only the courses registered by a specific student.

Example response:

```json
{
  "success": true,
  "message": "Student courses retrieved successfully",
  "data": {
    "count": 2,
    "courses": [
      {
        "_id": "course_id_1",
        "courseCode": "CPE301",
        "courseTitle": "Computer Networks"
      },
      {
        "_id": "course_id_2",
        "courseCode": "CPE305",
        "courseTitle": "Database Systems"
      }
    ]
  }
}
```

---

### Add Course to Student

```http
PATCH /api/students/:studentId/courses/:courseId
```

Adds a course reference to the student's `courses` array.

The API validates:

- Student ID
- Course ID
- Student existence
- Course existence
- Duplicate course registration

---

### Remove Course from Student

```http
DELETE /api/students/:studentId/courses/:courseId
```

Removes a course reference from the student's `courses` array.

---

# Course Endpoints

### Create Course

```http
POST /api/courses
```

The request uses:

```text
multipart/form-data
```

Fields:

```text
courseCode
courseTitle
image
```

Example:

```text
courseCode: CPE301
courseTitle: Computer Networks
image: selected image file
```

The image is first handled by Multer and then uploaded to Cloudinary.

The Cloudinary image URL is stored in the course document.

---

### Get All Courses

```http
GET /api/courses
```

Returns all courses available for registration.

---

### Get One Course

```http
GET /api/courses/:id
```

Returns one course using its MongoDB ObjectId.

---

### Update Course

```http
PATCH /api/courses/:id
```

The following can be updated:

- Course title
- Course image

The course code cannot be changed.

If a new image is provided, Multer handles the local upload and the image is uploaded to Cloudinary.

---

### Delete Course

```http
DELETE /api/courses/:id
```

Deleting a course also removes that course reference from every student who previously registered for it.

This prevents stale or broken references from remaining in student documents.

---

# API Route Summary

## Students

```text
POST    /api/students

GET     /api/students

GET     /api/students/:id

PATCH   /api/students/:id

DELETE  /api/students/:id

GET     /api/students/:id/courses

PATCH   /api/students/:studentId/courses/:courseId

DELETE  /api/students/:studentId/courses/:courseId
```

## Courses

```text
POST    /api/courses

GET     /api/courses

GET     /api/courses/:id

PATCH   /api/courses/:id

DELETE  /api/courses/:id
```

The project currently contains **13 API endpoints**.

---

# Database Design

The MongoDB database contains two main collections:

```text
studentPortal
│
├── students
│
└── courses
```

---

## Student Schema

Conceptually:

```javascript
{
  name: String,

  registrationNumber: String,

  email: String,

  courses: [
    {
      type: ObjectId,
      ref: "Course"
    }
  ]
}
```

---

## Course Schema

Conceptually:

```javascript
{
  courseCode: String,
  courseTitle: String,
  courseImage: String
}
```

---

# Mongoose Populate

Students store course IDs internally.

Example:

```json
{
  "name": "Jason Derulo",
  "courses": [
    "6a9de3610a2fe920b5de0abb"
  ]
}
```

Using:

```javascript
Student.findById(id).populate("courses");
```

Mongoose can return:

```json
{
  "name": "Jason Derulo",
  "courses": [
    {
      "_id": "6a9de3610a2fe920b5de0abb",
      "courseCode": "CPE301",
      "courseTitle": "Computer Networks"
    }
  ]
}
```

The Student document still stores the ObjectId internally. `populate()` only changes the returned result.

---

# Course Image Upload

Course images are handled in two stages.

```text
Client
   ↓
Multer
   ↓
uploads/
   ↓
Cloudinary
   ↓
Cloudinary image URL
   ↓
MongoDB
```

Multer handles the uploaded file using:

```javascript
upload.single("image")
```

Cloudinary then uploads the image and returns a secure URL.

That URL is stored as:

```javascript
courseImage
```

inside the Course document.

---

# Validation

The API currently validates several common problems.

### Student Validation

- Missing name
- Missing registration number
- Missing email
- Invalid MongoDB ObjectId
- Student not found
- Attempts to change registration number
- Attempts to change email
- Duplicate course registration
- Course not registered before removal

### Course Validation

- Missing course code
- Missing course title
- Missing course image
- Invalid course ID
- Course not found
- Duplicate course code
- Attempts to update course code

---

# HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `400` | Invalid request |
| `404` | Resource not found |
| `409` | Resource conflict / duplicate |
| `500` | Internal server error |

---

# Error Handling

The API includes a 404 route handler.

Example:

```json
{
  "success": false,
  "message": "Route GET /api/does-not-exist not found"
}
```

A global error-handling middleware is also included to handle unexpected server errors.

---

# CRUD Operations

## Students

| CRUD | HTTP | Operation |
|---|---|---|
| Create | POST | Create student |
| Read | GET | Retrieve student(s) |
| Update | PATCH | Update student |
| Delete | DELETE | Delete student |

## Courses

| CRUD | HTTP | Operation |
|---|---|---|
| Create | POST | Create course |
| Read | GET | Retrieve course(s) |
| Update | PATCH | Update course |
| Delete | DELETE | Delete course |

---

# Concepts Demonstrated

This project demonstrates practical use of:

- Node.js
- Express.js
- REST API design
- MongoDB Atlas
- Mongoose
- CRUD operations
- Schemas and models
- Controllers
- Express routers
- Request parameters
- Request bodies
- Middleware
- Environment variables
- HTTP status codes
- Validation
- Error handling
- MongoDB ObjectIds
- Database relationships
- Document referencing
- Mongoose `populate()`
- Array relationships
- MongoDB `$pull`
- MongoDB `updateMany()`
- Multer
- Multipart form data
- Cloudinary
- File uploads

---

# Future Improvements

Possible future additions include:

- Student authentication
- Password hashing with bcrypt
- JWT authentication
- Authorization
- Admin accounts
- Course registration limits
- Course capacity
- Departments and faculties
- Semester support
- Course units
- Student levels
- Search and filtering
- Pagination
- Email validation
- Student profile images
- Role-based access control
- Delete old Cloudinary images when replacing course images
- Automatically clean temporary files from the local `uploads` directory
- API documentation using Swagger/OpenAPI
- Deployment

---

## Author

**Elshaddai**

Backend Development Learning Project